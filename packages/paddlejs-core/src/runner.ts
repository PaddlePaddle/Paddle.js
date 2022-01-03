import Loader from './loader';
import Graph from './graph';
import { Model, RunnerConfig, ModelOp, InputFeed, ModelVar, GraphType, FeedShape } from './commons/interface';
import OpData from './opFactory/opDataBuilder';
import Tensor from './opFactory/tensor';
import { GLOBALS } from './globals';
import { getGlobalInterface, findVarByKey, AddItemToVars } from './commons/utils';
import MediaProcessor from './mediaProcessor';
import env from './env';

import type OpExecutor from './opFactory/opExecutor';

import { accShape } from './opFactory/utils';
import postOpsList from './postOps';

export default class Runner {
    // instance field
    runnerConfig: RunnerConfig = {} as RunnerConfig;
    modelName: string;
    isPaused: boolean = false;
    model: Model = {} as Model;
    weightMap: OpExecutor[] = [];
    isExecuted: boolean = false;
    test: boolean = false;
    graphGenerator: Graph = {} as Graph;
    mediaProcessor: MediaProcessor | null = null;
    needPreheat: boolean = true;
    multiOutputs?: ModelOp[];
    postOps?: ModelOp[];
    index?: number;
    feedShape: FeedShape = {} as FeedShape;

    constructor(options: RunnerConfig | null) {
        this.runnerConfig = Object.assign({}, options);
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

        this.isExecuted = false;
        if (env.get('backend') === 'wasm') {
            await Promise.all([this.load(), GLOBALS.backendInstance.init()]);
        }
        else {
            GLOBALS.backendInstance.init();
            this.isExecuted = false;
            await this.load();
        }
        this.genFeedData();
        this.genGraph();
        this.genOpData();

        if (env.get('backend') === 'wasm') {
            // the initialization of wasm backend relies on the generated weightMap
            this.model = Object.assign(this.model, this.runnerConfig);
            this.model.index = await GLOBALS.backendInstance.initWasm(this.model, this.weightMap);
            return [];
        }

        if (this.needPreheat) {
            return await this.preheat();
        }
    }

    async load() {
        const { modelPath, modelObj = null } = this.runnerConfig;
        if (modelPath) {
            const loader = new Loader(modelPath);
            this.model = await loader.load();
        }
        else if (modelObj?.model && modelObj?.params) {
            const {
                model,
                params
            } = modelObj;
            Loader.allocateParamsVar(model.vars, params);
            this.model = model;
        }
    }

    genGraph() {
        this.graphGenerator = new Graph(this.model, this.runnerConfig);
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
                    this.model,
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

        let inputFeed = [];
        if (this.runnerConfig.webglFeedProcess) {
            inputFeed = [media];
        }
        else {
            inputFeed = this.mediaProcessor.process(
                media,
                this.runnerConfig,
                this.feedShape
            );
        }

        let result = [];
        if (env.get('backend') === 'wasm') {
            await GLOBALS.backendInstance.predict(inputFeed[0].data, this.model.index);
            const data = await this.read();
            result = this.postProcess(data);
        }
        else {
            this.updateFeedData(inputFeed);
            result = await this.execute();
        }

        this.isExecuted = true;
        return callback ? callback(result) : result;
    }

    async predictWithFeed(data: number[] | InputFeed[] | ImageData, callback?, shape?: number[]) {
        const { fc = 3, fw, fh } = this.feedShape;
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

        let result = [];
        if (env.get('backend') === 'wasm') {
            await GLOBALS.backendInstance.predict(inputFeed[0].data, this.model.index);
            const data = await this.read();
            result = this.postProcess(data);
        }
        else {
            this.updateFeedData(inputFeed);
            result = await this.execute();
        }

        this.isExecuted = true;
        return callback ? callback(result) : result;
    }

    genFeedData() {
        const { type, feedShape, webglFeedProcess } = this.runnerConfig;
        this.feedShape = this.model.feedShape || feedShape;
        const { fc = 3, fh, fw } = this.feedShape;
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
                    const [w, h, c, n = 1] = shape.reverse();

                    feedInfo.data = new Float32Array(n * c * h * w);
                    return feedInfo;
                });
            }
        }
        else {
            const feedC = env.get('backend') !== 'wasm' && webglFeedProcess ? 4 : fc;
            preheatFeedData = findVarByKey(vars, 'image');
            const imageBaseInfo = {
                name: 'image',
                shape: [1, feedC, fh, fw]
            };
            preheatFeedData = Object.assign(
                imageBaseInfo,
                preheatFeedData,
                {
                    data: new Float32Array(feedC * fh * fw).fill(1.0),
                    persistable: true
                }
            );
        }

        AddItemToVars(vars, preheatFeedData);
    }

    updateFeedData(inputFeed) {
        const feed = inputFeed[0];
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
        imageInputTensor.data = feed.data;

        // todo
        if (this.runnerConfig.webglFeedProcess || env.get('webgl_gpu_pipeline')) {
            // support imageDataLike feed which has unit8ClampedArray data and width + height or shape
            // support ImageElementLike feed which is HTMLImageElement or HTMLVideoElement or HTMLCanvasElement
            let shape = feed.shape || [1, 1, feed.height, feed.width];
            let feedData = new Uint8Array(feed.data || []);
            const isImageElementLike = feed.width && feed.height && !feed.data;
            if (isImageElementLike) {
                const w = (feed as HTMLImageElement).naturalWidth || feed.width;
                const h = (feed as HTMLImageElement).naturalHeight || feed.height;
                shape = [1, 1, h, w];
                feedData = feed;
            }

            const imageInputTensorParams = imageInputTensor.opts;
            imageInputTensorParams.shape = shape;
            const imageOpData = imageOp.opData;
            const imageTensor = new Tensor(imageInputTensorParams);
            imageTensor.data = feedData;
            imageOpData.inputTensors = [imageTensor];

            const [h, w] = shape.slice(-2);
            const [dh, dw] = imageOpData.outputTensors[0].shape.slice(-2);
            const scale = this.mediaProcessor.cover(w, h, dw, dh);
            imageOp.uniform.u_scale.value = scale;
        }

    }

    async execute() {
        const feedOp = this.graphGenerator.getFeedExecutor() as OpExecutor;
        this.executeOp(feedOp);
        const data = await this.read();

        const res = this.postProcess(data);

        return res;
    }

    postProcess(data) {
        const isWasm = env.get('backend') === 'wasm';
        if (env.get('debug')) {
            return data;
        }
        // 多输出数据拆分
        let result = data;
        const { multiOutputs, postOps } = this.model;
        if (multiOutputs) {
            if (isWasm) {
                // wasm数据已经是数组
                result = multiOutputs.map((output, index) => {
                    return { [output.name]: data[index] };
                });
            }
            else {
                let sumVal = 0;
                result = multiOutputs.map(output => {
                    const totalShape = accShape(output.shape);
                    const curData = data.slice(sumVal, totalShape + sumVal);
                    sumVal += totalShape;
                    return { [output.name]: curData };
                });
            }
        }

        if (multiOutputs && postOps && postOps.length) {
            // 执行后续op，如multiclass_nms
            for (let i = 0, len = postOps.length; i < len; i++) {
                // 提取op信息
                const { type, attrs: attr, inputs: inputsObj } = postOps[i] as ModelOp;
                const postOp = postOpsList[type] as Function;
                if (!postOp) {
                    return;
                }

                const outputsData = [...result];

                const inputsData = Object.keys(inputsObj).map(key => {
                    const item = inputsObj[key];
                    const { name, shape } = item;
                    const cur = outputsData.filter(cur => cur[name]);
                    if (!cur || !cur[0] || !cur[0][name]) {
                        console.error(`未获取到${name}的数据`);
                        return null;
                    }
                    return {
                        name: key,
                        tensorId: name,
                        data: cur[0][name],
                        shape
                    };
                });
                // 执行op, 注意：shape是原始的
                result = postOp(inputsData, attr);
            }
        }
        return result;
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
            && op.opData.outputTensors[op.opData.outputTensors.length - 1]
            && op.opData.outputTensors[op.opData.outputTensors.length - 1].tensorId === this.modelName + '_'
                + (env.get('ns').layerName || env.get('layerName'))) {
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
            shape: fetchOp.attrs['origin_shape'] || fetchVar.shape,
            index: this.model.index

        };
        return await GLOBALS.backendInstance.read(fetchInfo);
    }

    stopPredict() {
        this.isPaused = true;
    }
}
