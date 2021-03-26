import Loader from './loader';
import Graph from './graph';
import { Model, InputFeed, ModelVar, GraphType } from './commons/interface';
import OpData from './opFactory/opDataBuilder';
import { GLOBALS, getGlobalNamespace } from './globals';
import MediaProcessor from './mediaProcessor';
import env from './env';

import type OpExecutor from './opFactory/opExecutor';
import type Transformer from './transform/transformer';

interface ModelConfig {
    modelPath: string;
    feedShape: {
        fw: number;
        fh: number;
    };
    targetSize?: {
        height: number;
        width: number;
    };
    fileCount?: number; // 参数分片chunk_*.dat 个数
    fill?: string; // 缩放后用什么颜色填充不足方形部分
    mean?: number[];
    std?: number[];
    bgr?: boolean;
    scale?: number;
    type?: GraphType; // model type
    needPreheat?: boolean;
    plugins?: { // tranform graph plugins
        preTransforms?: Transformer[]; // before creating graph
        transforms?: Transformer[]; // while traversing the ops map
        postTransforms?: Transformer[]; // after creating graph
    };
}

export default class Runner {
    // instance field
    modelConfig: ModelConfig = {} as ModelConfig;
    isPaused: boolean = false;
    model: Model = {} as Model;
    weightMap: OpExecutor[] = [];
    isExecuted: boolean = false;
    test: boolean = false;
    graphGenerator: Graph = {} as Graph;
    mediaProcessor: MediaProcessor | null = null;
    needPreheat: boolean = true;

    constructor(options: ModelConfig | null) {
        const opts = {
            fill: '#fff',
            scale: 256
        };
        this.modelConfig = Object.assign(opts, options);
        this.needPreheat = options.needPreheat === undefined ? true : options.needPreheat;
        this.weightMap = [];

        env.set('ns', getGlobalNamespace());
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
        const { modelPath, fileCount } = this.modelConfig;
        const loader = new Loader(modelPath, fileCount);
        this.model = await loader.load();
    }

    genGraph() {
        this.graphGenerator = new Graph(this.model, this.modelConfig.type, this.modelConfig.plugins);
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
                    isFinalOp
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

    genFeedData() {
        const { type, feedShape } = this.modelConfig;
        const { fh, fw } = feedShape;
        const vars = this.model.vars;

        let preheatFeedData;
        if (type === GraphType.MultipleInput) {
            // 默认第1个是输入op, 形为inputs: {X: [a, b]}
            const feedOpInputs = this.model.ops && this.model.ops[0] && this.model.ops[0].inputs?.X;
            if (feedOpInputs.length > 1) {
                // 多输入
                preheatFeedData = feedOpInputs.map(inputName => {
                    const feedInfo = vars.find(item => item.name === inputName);
                    const shape = feedInfo.shape;
                    const [w, h, c = 3, n = 1] = shape.reverse();

                    feedInfo.data = new Float32Array(n * c * h * w);
                    return feedInfo;
                });
            }
        }

        else {
            preheatFeedData = vars.find(item => item.name === 'image');
            if (preheatFeedData) {
                preheatFeedData.data = new Float32Array(3 * fh * fw).fill(1.0);
                return;
            }
            preheatFeedData = {
                data: new Float32Array(3 * fh * fw).fill(1.0),
                name: 'image',
                shape: [1, 3, fh, fw]
            };
        }

        vars.push(preheatFeedData);
    }

    updateFeedData(feed) {
        const imageOp = this.weightMap.find(item => {
            if (!item.opData) {
                return null;
            }
            const tensorData = item.opData.inputTensors;
            return tensorData.find(tensor => tensor.tensorId === 'image');
        }) as OpExecutor;
        const imageData = imageOp.opData.inputTensors.find(
            tensor => tensor.tensorId === 'image'
        );
        imageData.data = feed[0].data;
    }

    async execute() {
        const feedOp = this.graphGenerator.getFeedExecutor() as OpExecutor;
        this.executeOp(feedOp);
        return await this.read();
    }

    executeOp(op: OpExecutor) {
        if (op.type === 'fetch') {
            return;
        }
        op.execute(this.isExecuted);
        if (env.get('debug')
            && op.opData?.outputTensors
            && op.opData.outputTensors[0]
            && op.opData.outputTensors[0].tensorId === env.get('ns').layerName) {
            console.info(op.opData.name, 'runner op name');
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
        const fetchInfo = this.model.vars.find(
            item => item.name === fetchOp.inputs.X[0]
        ) as ModelVar;
        return await GLOBALS.backendInstance.read(fetchInfo);
    }

    stopPredict() {
        this.isPaused = true;
    }
}
