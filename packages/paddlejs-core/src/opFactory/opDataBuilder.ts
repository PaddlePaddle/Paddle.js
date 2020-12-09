import { ModelVar, OpExecutor, OpInputs, OpOutputs, AttrsData, InputFeed } from '../commons/interface';
import { GLOBALS } from '../globals';
import Tensor from './tensor';
import opBehaviors from './opBehaviors';

// model的名字和paddleJS的tensor名字mapping

export default class OpData {
    name: string = '';
    isPackedOp: boolean = false;
    input: OpInputs = {} as OpInputs;
    output: OpOutputs = {} as OpOutputs;
    data: AttrsData = {};
    attrs: any = {};
    inputTensors: Tensor[] = [];
    outputTensors: Tensor[] = [];
    fShaderParams: any = [];
    vars: ModelVar[] = [];
    iLayer: number = 0;
    program: any[] = [];
    renderData: any[] = [];
    inputFeed: InputFeed | undefined = {} as InputFeed;

    constructor(op: OpExecutor, iLayer: number, vars: ModelVar[], feed?: InputFeed) {
        const {
            type,
            inputs,
            outputs,
            attrs,
            isPacked
        } = op;

        this.attrs = attrs;
        this.name = type;
        this.isPackedOp = isPacked;
        this.checkMergeOp();
        this.vars = vars;
        this.iLayer = iLayer;
        this.inputFeed = feed;

        const isPass = this.checkIsPass();
        if (isPass) {
            this.input = inputs;
            this.output = outputs;
            // op数据, 当前不扩展
            this.data = {
                active_function: 'scale',
                multi_value: '1.0',
                bias_value: '0.0',
                fuse_relu: false
            };

            // tensor数据
            this.inputTensors = [];
            this.outputTensors = [];
            this.fShaderParams = [];
            this.program = [];
            this.renderData = [];

            this.constructData();
            this.buildTensor();
            this.buildShaderParams();
            this.buildProgram();
        }


    }

    constructData() {
        Object.keys(this.output).forEach(key => {
            this.output[key].forEach((name: string, index: number) => {
                this.output[key][index] = this.getTensorAttr(name)[0];
            });
        });
        Object.keys(this.input).forEach(key => {
            if (this.input[key][0] === 'image') {
                this.input[key] = [this.inputFeed];
            }
            else {
                this.input[key] = this.getTensorAttr(this.input[key][0]);
            }
        });
    }

    getTensorAttr(name: string) {
        return this.vars.filter(item => item.name === name);
    }

    buildProgram() {
        const name = this.name;
        this.program = this.outputTensors.map((outTensor, index) => GLOBALS.backendInstance.createProgram({
            name,
            outTensor,
            shaderParams: this.fShaderParams[index],
            runtime: index,
            isPacked: this.isPackedOp || false
        }));
    }

    buildRenderData() {
        const backendInstance = GLOBALS.backendInstance;
        if (backendInstance.createRenderData) { // webgpu 不需要
            this.renderData = backendInstance.createRenderData(this.inputTensors);
        }
    }

    buildTensor() {
        // todo: 是否需要形状对齐
        // todo: 是否需要广播tensor
        const tensorName: any = {
            input: 'origin',
            x: 'origin',
            filter: 'filter',
            y: 'counter',
            z: 'appender',
            output: 'out',
            out: 'out',
            scale: 'scale',
            bias: 'bias',
            mean: 'mean',
            variance: 'variance',
            w: 'weight'
        };
        const tensorData: any = [];
        for (const key in this.input) {
            if (Object.prototype.hasOwnProperty.call(this.input, key)) {
                const data = this.input[key] || [{}];
                // 默认取第一个数据
                if (tensorName[key.toLowerCase()]) {
                    data[0].tensorName = tensorName[key.toLowerCase()];

                    tensorData.push(data[0]);
                }
            }
        }
        // debugger
        // todo: 临时删除output里的Y
        delete this.output.Y;
        // 输出tensor
        for (const key in this.output) {
            if (Object.prototype.hasOwnProperty.call(this.output, key)) {
                // 默认取第一个数据
                const data = this.output[key] || [{}];
                if (tensorName[key.toLowerCase()]) {
                    data.forEach((item: any) => {
                        item.tensorName = tensorName[key.toLowerCase()];
                        tensorData.push(item);
                    });
                }
            }
        }

        // unique behavior
        const opKey = `${GLOBALS.backend}_${this.name}`;
        const behaviorKeys = GLOBALS.opRegistry.ops[opKey]
            ? GLOBALS.opRegistry.ops[opKey].behaviors || []
            : [];
        behaviorKeys.forEach(key => {
            opBehaviors[key].call(this, tensorData);
        });

        // 生成tensor对象
        tensorData.forEach((data: any, index: number) => {
            if (data) {
                let tensor: any = null;
                const tensorName = data.tensorName;
                if (data.notTensor) {
                    tensor = {
                        name: tensorName,
                        data: new Float32Array(data.data),
                        total_shape: data.data.length
                    };
                }
                else {
                    tensor = new Tensor({
                        type: data.name,
                        name: tensorName,
                        shape: data.shape,
                        data: data.data,
                        needBatch: data.needBatch || false,
                        notCompressed: data.notCompressed || false,
                        isPacked: this.isPackedOp || false,
                        binding: index
                    });
                }
                if (tensorName === 'out') {
                    this.outputTensors.push(tensor);
                }
                else {
                    this.inputTensors.push(tensor);
                }
            }
        });
    }

    buildShaderParams() {
        // 从tensor对象中获取的数据
        const tensorAttrs = [
            'length_shape',
            'width_shape',
            'height_shape',
            'width_texture',
            'height_texture',
            'limit',
            'channel',
            'total_shape',
            'binding'
        ];

        for (const key in this.attrs) {
            if (Object.prototype.hasOwnProperty.call(this.attrs, key)) {
                const item = this.attrs[key];
                this.data[key] = item;
            }
        }
        // 遍历 获取input tensor的数据
        this.inputTensors.forEach((inputTensor: any) => {
            tensorAttrs.forEach(attr => {
                this.data[attr + '_' + inputTensor.name] = inputTensor[attr];
            });
        });

        // 根据out tensor 个数 生成对应的 fShader 个数
        this.outputTensors.forEach((outTensor: any) => {
            const params = JSON.parse(JSON.stringify(this.data));
            // 获取output tensor的数据

            tensorAttrs.forEach(attr => {
                params[attr + '_' + outTensor.name] = outTensor[attr];
            });
            this.fShaderParams.push(params);
        });
    }

    checkMergeOp() {
        const mergeType = 'conv2d-elementwise_add';
        if (this.name.indexOf(mergeType) > -1
            && Object.prototype.toString.apply(this.attrs) === '[object Array]') {
            // 第一个融合op
            this.name = 'conv2d_elementwise_add';
        }
    }

    checkIsPass() {
        if (this.name === 'dropout') {
            if (this.attrs['dropout_implementation'] === 'downgrade_in_infer') {
                this.name = 'scale';
                this.attrs['scale'] = this.attrs['dropout_prob'];
                this.attrs['bias'] = 0.0;
                return true;
            }
            return false;
        }
        if (this.name === 'depthwise_conv2d') {
            this.name = 'conv2d';
        }
        return true;
    }
}
