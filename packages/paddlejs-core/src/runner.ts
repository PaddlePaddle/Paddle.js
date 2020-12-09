import Loader from './loader';
import Graph from './graph';
import { Model } from './commons/interface';
import OpData from './opFactory/opDataBuilder';
import { GLOBALS } from './globals';
import type OpExecutor from './opFactory/opExecutor';

interface ModelConfig {
    modelPath: string; // 模型路径
    feedShape: {
        fw: number;
        fh: number;
    };
    fetchShape: number[];
    targetSize: { // { height: fw, width: fh}
        height: number;
        width: number;
    }
    fileCount: number; // 参数分片chunk_*.dat 个数
    fill?: string; // 缩放后用什么颜色填充不足方形部分
    inputType?: string; // image | video
    needPreheat?: boolean; // 是否需要预热
}

interface InputFeed {
    data: Float32Array | number[];
    shape: number[];
    name: string;
    canvas?: number[];
}

export default class Runner {
    // instance field
    modelConfig: ModelConfig = {
        modelPath: '',
        feedShape: {
            fw: 224,
            fh: 224
        },
        fetchShape: [],
        targetSize: {
            height: 224,
            width: 224
        },
        fileCount: 1
    };

    flags = {};
    model: Model = {} as Model;
    weightMap: OpExecutor[] = [];
    isExecuted: boolean = false;
    test: boolean = false;
    graphGenerator: Graph = {} as Graph;

    constructor(options: ModelConfig | null) {
        const opts = {
            needPreheat: true,
            inputType: 'image',
            fill: '#fff'
        };
        this.modelConfig = Object.assign(opts, options);
        this.flags = {
            isRunning: false,
            isPreheating: false,
            runVideoPaused: false
        };
        this.weightMap = [];
    }

    async init() {
        if (!GLOBALS.backendInstance) {
            console.error('ERROR: Havent register backend');
            return;
        }
        await GLOBALS.backendInstance.init();
        await this.load();
        this.genGraph();
        this.genOpData();
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
        this.graphGenerator = new Graph(this.model);
        this.weightMap = this.graphGenerator.createGraph();
    }

    genOpData() {
        const vars = this.model.vars;
        let iLayer = 0;
        this.weightMap.forEach((op: OpExecutor) => {
            const type = op.type;
            if (type !== 'feed' && type !== 'fetch') {
                iLayer++;
                const opData = new OpData(op, iLayer, vars);
                op.opData = opData;
            }
        });
    }

    async preheat() {
        await this.checkModelLoaded();
        const { fh, fw } = this.modelConfig.feedShape;
        const feed: InputFeed = {
            data: new Float32Array(3 * fh * fw).fill(5.0),
            name: 'image',
            shape: [1, 3, fh, fw]
        };
        this.execute(feed);
        this.isExecuted = true;
    }

    private async checkModelLoaded() {
        if (this.weightMap.length === 0) {
            console.info('It\'s better to preheat the model before running.');
            await this.load();
            this.genGraph();
            this.genOpData();
        }
    }

    async predict() {
        // deal with input, such as image, video
        // execute
    }

    async execute(feed) {
        console.log(feed);
        const FeedOp = this.graphGenerator.getFeedExecutor() as OpExecutor;
        this.executeOp(FeedOp);
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
        const fetchOp = this.graphGenerator.getFetchExecutor() as OpExecutor;
        return await GLOBALS.backendInstance.read(fetchOp);
    }
};
