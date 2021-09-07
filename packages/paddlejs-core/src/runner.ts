import Loader from './loader';
import Graph from './graph';
import { Model, ModelConfig, InputFeed, ModelVar, GraphType } from './commons/interface';
import OpData from './opFactory/opDataBuilder';
import Tensor from './opFactory/tensor';
import { GLOBALS } from './globals';
import { getGlobalInterface, findVarByKey, AddItemToVars } from './commons/utils';
import MediaProcessor from './mediaProcessor';
import env from './env';

import type OpExecutor from './opFactory/opExecutor';

import { accShape } from './opFactory/utils';

export default class Runner {
    // instance field
    modelConfig: ModelConfig = {} as ModelConfig;
    modelName: string;
    isPaused: boolean = false;
    model: Model = {} as Model;
    weightMap: OpExecutor[] = [];
    isExecuted: boolean = false;
    test: boolean = false;
    graphGenerator: Graph = {} as Graph;
    mediaProcessor: MediaProcessor | null = null;
    needPreheat: boolean = true;

    constructor(options: ModelConfig | null) {
        this.modelConfig = Object.assign({}, options);
        this.needPreheat = options.needPreheat === undefined ? true : options.needPreheat;
        this.modelName = options.modelName || Date.now().toString();
        this.weightMap = [];

        env.set('ns', getGlobalInterface());
        if (env.get('platform') !== 'node') {
            this.mediaProcessor = new MediaProcessor();
        }
    }

    async init() {
        if (!GLOBALS.backendInstance) {
            console.error('ERROR: Haven\'t register backend');
            return;
        }

        await GLOBALS.backendInstance.init();
        this.isExecuted = false;
        await this.load();
        this.genFeedData();
        this.genGraph();
        this.genOpData();
        if (this.needPreheat) {
            return await this.preheat();
        }
    }

    async load() {
        const { modelPath } = this.modelConfig;
        const loader = new Loader(modelPath);
        this.model = await loader.load();
    }

    genGraph() {
        this.graphGenerator = new Graph(this.model, this.modelConfig);
        this.weightMap = this.graphGenerator.createGraph();
    }

    genOpData() {
        let iLayer = 0;
        this.weightMap.forEach((op: OpExecutor, index: number) => {
            const type = op.type;
            if (type !== 'feed' && type !== 'fetch') {
                iLayer++;
                const isFinalOp = index === this.weightMap.length - 2;
                const opData = new OpData(
                    op,
                    iLayer,
                    this.model.vars,
                    isFinalOp,
                    this.modelName
                );
                op.opData = opData;
            }
        });
    }

    async preheat() {
        await this.checkModelLoaded();
        const result = await this.execute();
        this.isExecuted = true;
        return result;
    }

    async checkModelLoaded() {
        if (this.weightMap.length === 0) {
            console.info('It\'s better to preheat the model before running.');
            await this.load();
            this.genFeedData();
            this.genGraph();
            this.genOpData();
            this.isExecuted = false;
        }
    }

    async predict(media, callback?: Function) {
        // deal with input, such as image, video
        if (this.isPaused || !this.mediaProcessor) {
            return;
        }

        const inputFeed: InputFeed[] = this.mediaProcessor.process(
            media,
            this.modelConfig
        );
        this.updateFeedData(inputFeed);
        const result = await this.execute();
        this.isExecuted = true;
        return callback ? callback(result) : result;
    }

    async predictWithFeed(data: number[] | InputFeed[] | ImageData, callback?, shape?: number[]) {
        const { fc = 3, fw, fh } = this.modelConfig.feedShape;
        let inputFeed;

        if (Array.isArray(data)) {
            if ((data[0] as InputFeed)?.data) {
                // 已经构建好的inputFeed
                const inputData = (data[0] as InputFeed).data;

                // 确保输入是Float32Array
                if (!(inputData instanceof Float32Array)) {
                    (data[0] as InputFeed).data = new Float32Array(inputData);
                }
                inputFeed = data;
            }
            else {
                inputFeed = [
                    {
                        data: new Float32Array(data as number[]),
                        shape: shape || [1, fc, fh, fw],
                        name: 'image',
                        persistable: true
                    }
                ];
            }
        }
        else {
            // 类imageData类型
            const { width, height, data: inputData } = data as ImageData;
            inputFeed = [
                {
                    data: new Float32Array(inputData),
                    shape: shape || [1, fc, height || fh, width || fw],
                    name: 'image',
                    persistable: true
                }
            ];
        }

        this.updateFeedData(inputFeed);
        const result = await this.execute();
        this.isExecuted = true;
        return callback ? callback(result) : result;
    }

    genFeedData() {
        const { type, feedShape } = this.modelConfig;
        const { fc = 3, fh, fw } = feedShape;
        const vars = this.model.vars;
        let preheatFeedData;
        if (type === GraphType.MultipleInput) {
            // 默认第1个是输入op, 形为inputs: {X: [a, b]}
            const feedOpInputs = this.model.ops && this.model.ops[0] && this.model.ops[0].inputs?.X;
            if (feedOpInputs.length > 1) {
                // 多输入
                preheatFeedData = feedOpInputs.map(inputName => {
                    const feedInfo = findVarByKey(vars, inputName);
                    const shape = feedInfo.shape;
                    const [w, h, c = 3, n = 1] = shape.reverse();

                    feedInfo.data = new Float32Array(n * c * h * w);
                    return feedInfo;
                });
            }
        }
        else {
            preheatFeedData = findVarByKey(vars, 'image');
            if (preheatFeedData) {
                preheatFeedData.data = new Float32Array(fc * fh * fw).fill(1.0);
                return;
            }
            preheatFeedData = {
                data: new Float32Array(fc * fh * fw).fill(1.0),
                name: 'image',
                shape: [1, fc, fh, fw],
                persistable: true
            };
        }

        AddItemToVars(vars, preheatFeedData);
    }

    updateFeedData(feed) {
        const imageOp = this.weightMap.find(item => {
            if (!item.opData) {
                return null;
            }
            const tensorData = item.opData.inputTensors;
            return tensorData.find(tensor => tensor.tensorId.endsWith('_image'));
        }) as OpExecutor;

        const imageInputTensor = imageOp.opData.inputTensors.find(
            tensor => tensor.tensorId.endsWith('_image')
        );
        imageInputTensor.data = feed[0].data;

        if (env.get('webgl_feed_process') || env.get('webgl_gpu_pipeline')) {
            const imageInputTensorParams = imageInputTensor.opts;
            imageInputTensorParams.shape = feed[0].shape;
            imageInputTensorParams.data = feed[0].data;
            imageOp.opData.inputTensors = [new Tensor(imageInputTensorParams)];
        }
    }

    async execute() {
        const feedOp = this.graphGenerator.getFeedExecutor() as OpExecutor;
        this.executeOp(feedOp);
        const data = await this.read();

        // 多输出数据拆分
        const multiOutputs = this.model.multiOutputs;
        if (multiOutputs) {
            let sumVal = 0;
            return multiOutputs.map(output => {
                const totalShape = accShape(output.shape);
                const curData = data.slice(sumVal, totalShape + sumVal);
                sumVal += totalShape;
                return { [output.name]: curData };
            });
        }

        return data;
    }

    executeOp(op: OpExecutor) {
        if (op.type === 'fetch') {
            return;
        }
        if (op.type !== 'feed') {
            op.execute(this.isExecuted);
        }

        if (env.get('debug')
            && op.opData?.outputTensors
            && op.opData.outputTensors[0]
            && op.opData.outputTensors[0].tensorId === this.modelName + '_' + env.get('ns').layerName) {
            console.info(op.opData.name + '_' + op.opData.iLayer, 'runner op');
            return;
        }
        if (op.next) {
            const id = op.next;
            const next = this.graphGenerator.getExecutorById(id) as OpExecutor;
            this.executeOp(next);
        }
    }

    async read() {
        const fetchOp = this.graphGenerator.getFetchExecutor();
        const fetchVar = findVarByKey(this.model.vars, fetchOp.inputs.X[0]) as ModelVar;
        const fetchInfo = {
            name: fetchVar.name,
            shape: fetchOp.attrs['origin_shape'] || fetchVar.shape
        };
        return await GLOBALS.backendInstance.read(fetchInfo);
    }

    stopPredict() {
        this.isPaused = true;
    }
}
