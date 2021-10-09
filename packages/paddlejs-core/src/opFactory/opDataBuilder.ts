import {
    ModelVar, Model, OpExecutor, OpInputs, OpOutputs,
    AttrsData, BufferType, OpUniform
} from '../commons/interface';
import { GLOBALS } from '../globals';
import Tensor from './tensor';
import opBehaviors from './opBehaviors';
import * as Utils from './utils';
import { findVarByKey } from '../commons/utils';

// model的名字和paddleJS的tensor名字mapping

export default class OpData {
    name: string = '';
    realName: string = '';
    isPackedOp: boolean = false;
    input: OpInputs = {} as OpInputs;
    output: OpOutputs = {} as OpOutputs;
    data: AttrsData = {};
    attrs: object = {};
    subAttrs: object[] = [];
    uniform: OpUniform | null = null;
    inputTensors: Tensor[] = [];
    outputTensors: Tensor[] = [];
    fShaderParams: object[] = [];
    vars: ModelVar[] = [];
    dataLayout: string = '';
    iLayer: number = 0;
    program: string[] = [];
    tensorData: ModelVar[] = [];
    isFinalOp: boolean = false;
    modelName: string;
    bufferType: BufferType = BufferType.FrameBuffer;

    constructor(op: OpExecutor, iLayer: number, model: Model, isFinalOp: boolean, modelName: string) {
        const {
            type,
            inputs,
            outputs,
            attrs,
            isPacked,
            bufferType = BufferType.FrameBuffer,
            uniform = null
        } = op;

        this.modelName = modelName;
        this.attrs = attrs;
        this.subAttrs = op.subAttrs;
        this.name = type;
        this.realName = type;
        this.isPackedOp = isPacked;
        this.bufferType = bufferType;
        this.vars = model.vars;
        this.dataLayout = model.dataLayout || '';
        this.iLayer = iLayer;
        this.isFinalOp = isFinalOp;
        this.input = inputs;
        this.output = outputs;
        this.uniform = uniform;
        // tensor数据
        this.inputTensors = [];
        this.outputTensors = [];
        this.fShaderParams = [];
        this.program = [];

        this.constructTensorData();
        this.buildTensor();
        this.buildShaderParams();
        this.buildProgram();

    }

    constructTensorData() {
        Object.keys(this.output).forEach(key => {
            this.output[key].forEach((name: string, index: number) => {
                this.output[key][index] = this.getTensorVar(name);
            });
        });

        Object.keys(this.input).forEach(key => {
            this.input[key] = [this.getTensorVar(this.input[key][0])];
        });

        for (const key in this.output) {
            if (Object.prototype.hasOwnProperty.call(this.output, key)) {
                try {
                    // 默认取第一个数据
                    const data = this.output[key] || [{}];
                    const tensorName = this.getExactTensorName(key, 'output');
                    if (tensorName) {
                        data.forEach((item: ModelVar, index: number) => {
                            item.tensorName = tensorName;
                            this.tensorData.push({ ...item, tensorName, runtime: index });
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }

        for (const key in this.input) {
            if (Object.prototype.hasOwnProperty.call(this.input, key)) {
                const data = this.input[key].length > 0 ? this.input[key] : [{}];
                // 默认取第一个数据
                const tensorName = this.getExactTensorName(key, 'input');
                if (tensorName) {
                    const tensor = data[0];
                    tensor.tensorName = tensorName;
                    this.tensorData.push({ ...tensor, tensorName });
                }
            }
        }
    }

    getExactTensorName(name, type) {
        // name map
        const intputTensorName = {
            input: 'origin',
            x: 'origin',
            filter: 'filter',
            y: 'counter',
            z: 'appender',
            m: 'fourth',
            scale: 'scale',
            bias: 'bias',
            mean: 'mean',
            variance: 'variance',
            w: 'weight',
            weightlist_0: 'weightlist_0',
            weightlist_1: 'weightlist_1',
            weightlist_2: 'weightlist_2',
            weightlist_3: 'weightlist_3',
            prestate: 'prestate'
        };

        const outTensorName = {
            output: 'out',
            y: 'out',
            out: 'out',
            scale: 'scale',
            bias: 'bias',
            mean: 'mean',
            variance: 'variance',
            mask: 'out'
        };


        return type === 'input'
            ? intputTensorName[name.toLowerCase()] || name.toLowerCase()
            : outTensorName[name.toLowerCase()];
    }

    getTensorVar(name: string) {
        const varName = name.replace(/_packed$/, '');
        const data = findVarByKey(this.vars, varName);
        if (data && name.endsWith('_packed')) {
            const packedData = Utils.packOpData(data, name);
            return packedData;
        }
        return data;
    }

    buildProgram() {
        const name = this.name;
        const opKey = `${GLOBALS.backend}_${name}`;
        const op = GLOBALS.opRegistry.ops[opKey];
        try {
            if (!op) {
                throw new Error(`[unregistered op] ${name}`);
            }
            const inputTensors = this.inputTensors;
            this.program = this.outputTensors.map((outTensor, index) => GLOBALS.backendInstance.createProgram({
                op,
                outTensor,
                inputTensors,
                shaderParams: this.fShaderParams[index],
                runtime: index,
                isFinalOp: this.isFinalOp
            }));
        }
        catch (e) {
            console.error(e);
        }
    }

    // process op tensorData and attrs according to op behaviors
    processTensorDataAndAttrs() {
        try {
            // checkIsMerge
            if (this.name.indexOf('conv2d-elementwise_add') > -1) {
                this.name = 'conv2d_elementwise_add';
            }

            if (this.name.indexOf('flatten2') > -1) {
                this.name = 'reshape2';
            }

            if (this.name.indexOf('max_pool2d_with_index') > -1) {
                this.name = 'pool2d_max';
            }

            const tensorData: ModelVar[] = this.tensorData;
            // unique behavior
            const opKey = `${GLOBALS.backend}_${this.name}`;
            const behaviorKeys = GLOBALS.opRegistry.ops[opKey]
                ? GLOBALS.opRegistry.ops[opKey].behaviors || []
                : [];
            behaviorKeys.forEach(key => {
                opBehaviors[key].call(this, tensorData);
            });
        }
        catch (e) {
            console.error(e);
        }
    }

    buildTensor() {
        this.processTensorDataAndAttrs();
        const tensorData: ModelVar[] = this.tensorData;
        // 生成tensor对象
        tensorData.forEach((data: ModelVar, index: number) => {
            const tensorName = data.tensorName as string;
            const tensor = new Tensor({
                type: this.modelName + '_' + data.name,
                name: tensorName,
                shape: data.shape,
                data: data.data || null,
                persistable: data.persistable || false,
                interpType: data.interpType || 'NEAREST',
                isPacked: this.isPackedOp || data.packed || false,
                binding: index,
                noLayout: GLOBALS.backendInstance?.noLayout,
                dataLayout: this.dataLayout
            });
            if (tensorName === 'out') {
                this.outputTensors.push(tensor);
            }
            else {
                this.inputTensors.push(tensor);
            }

            data.shape = tensor.shape;
            data.total = tensor.total;
        });
    }

    buildShaderParams() {
        // 从tensor对象中获取的数据
        const tensorAttrs = [
            'length_shape',
            'length_unformatted_shape',
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
        this.inputTensors.forEach((inputTensor: Tensor) => {
            tensorAttrs.forEach(attr => {
                this.data[attr + '_' + inputTensor.name] = inputTensor[attr];
            });
        });

        // 根据out tensor 个数 生成对应的 fShader 个数
        this.outputTensors.forEach((outTensor: Tensor) => {
            const params = JSON.parse(JSON.stringify(this.data));
            // 获取output tensor的数据

            tensorAttrs.forEach(attr => {
                params[attr + '_' + outTensor.name] = outTensor[attr];
            });
            this.fShaderParams.push(params);
        });
    }
}
