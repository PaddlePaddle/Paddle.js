import Loader from './loader';
import Graph from './graph';
import { Model, InputFeed, ModelVar } from './commons/interface';
import OpData from './opFactory/opDataBuilder';
import { GLOBALS } from './globals';
import MediaProcessor from './mediaProcessor';

import type OpExecutor from './opFactory/opExecutor';

const mediaProcessor = new MediaProcessor();

interface ModelConfig {
    modelPath: string; // 模型路径
    feedShape: {
        fw: number;
        fh: number;
    };
    targetSize?: {
        height: number;
        width: number;
    }
    fileCount?: number; // 参数分片chunk_*.dat 个数
    fill?: string; // 缩放后用什么颜色填充不足方形部分
    mean?: number[];
    std?: number[];
    bgr?: boolean;
    inputType?: string; // image | video
}


export default class Runner {
    // instance field
    modelConfig: ModelConfig = {
        modelPath: '',
        feedShape: {
            fw: 224,
            fh: 224
        },
        targetSize: {
            height: 224,
            width: 224
        },
        fileCount: 1
    };

    isPaused: boolean = false;
    model: Model = {} as Model;
    weightMap: OpExecutor[] = [];
    isExecuted: boolean = false;
    test: boolean = false;
    graphGenerator: Graph = {} as Graph;
    feedData: InputFeed[] = [];

    constructor(options: ModelConfig | null) {
        const opts = {
            inputType: 'image',
            fill: '#fff'
        };
        this.modelConfig = Object.assign(opts, options);
        this.weightMap = [];
    }

    async init() {
        if (!GLOBALS.backendInstance) {
            console.error('ERROR: Haven\'t register backend');
            return;
        }
        await GLOBALS.backendInstance.init();
        this.isExecuted = false;
        await this.load();
        this.genGraph();
    }

    async load() {
        const {
            modelPath,
            fileCount
        } = this.modelConfig;

        const loader = new Loader(modelPath, fileCount);
        this.model = await loader.load();
    }

    genGraph() {
        this.graphGenerator = new Graph(this.model.ops);
        this.weightMap = this.graphGenerator.createGraph();
    }

    genOpData() {
        const vars = this.model.vars;
        let iLayer = 0;
        this.weightMap.forEach((op: OpExecutor, index: number) => {
            const type = op.type;
            if (type !== 'feed' && type !== 'fetch') {
                iLayer++;
                const isFinalOp = index === this.weightMap.length - 2;
                const opData = new OpData(op, iLayer, vars, this.feedData, isFinalOp);
                op.opData = opData;
            }
        });
    }

    async preheat() {
        await this.checkModelLoaded();
        const { fh, fw } = this.modelConfig.feedShape;
        const preheatFeed: InputFeed[] = [{
            data: new Float32Array(3 * fh * fw).fill(1.0),
            name: 'image',
            shape: [1, 3, fh, fw]
        }];
        const result = await this.execute(preheatFeed);
        this.isExecuted = true;
        return result;
    }

    async checkModelLoaded() {
        if (this.weightMap.length === 0) {
            console.info('It\'s better to preheat the model before running.');
            await this.load();
            this.genGraph();
        }
    }

    async predict(media, callback?: Function) {
        // deal with input, such as image, video
        if (this.isPaused) {
            return;
        }
        const inputFeed: InputFeed[] = mediaProcessor.process(media, this.modelConfig);
        const result = await this.execute(inputFeed);
        return callback
            ? callback(result)
            : result;
    }

    async execute(feed) {
        this.feedData = feed;
        if (!this.isExecuted) {
            this.genOpData();
        }
        const feedOp = this.graphGenerator.getFeedExecutor() as OpExecutor;
        this.executeOp(feedOp);
        return await this.read();
    }

    executeOp(op: OpExecutor) {
        if (op.type === 'fetch') {
            return;
        }
        op.execute(this.isExecuted);
        if (op.next) {
            const id = op.next;
            const next = this.graphGenerator.getExecutorById(id) as OpExecutor;
            this.executeOp(next);
        }
    }

    async read() {
        const fetchOp = this.graphGenerator.getFetchExecutor();
        const fetchInfo = this.model.vars.find(item => item.name === fetchOp.inputs.X[0]) as ModelVar;
        return await GLOBALS.backendInstance.read(fetchInfo);
    }

    stopPredict() {
        this.isPaused = true;
    }
};
