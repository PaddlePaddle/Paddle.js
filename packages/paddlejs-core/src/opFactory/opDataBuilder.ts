import {
    ModelVar, Model, OpExecutor, OpInputs, OpOutputs,
    AttrsData, BufferType, OpUniform, ModelVarMap
} from '../commons/interface';
import { GLOBALS } from '../globals';
import { env } from '../';
import { findVarByKey } from '../commons/utils';
import Tensor from './tensor';
import opBehaviors from './opBehaviors';
import * as Utils from './utils';

export default class OpData {
    name: string = '';
    isPackedOp: boolean = false;
    processedAttrs: AttrsData = {};
    subAttrs: AttrsData[] = [];
    uniform: OpUniform | null = null;
    inputTensors: Tensor[] = [];
    outputTensors: Tensor[] = [];
    dataLayout: string = '';
    iLayer: number = 0;
    program: string[] = [];
    isFinalOp: boolean = false;
    modelName: string;
    bufferType: BufferType = BufferType.FrameBuffer;
    tensorDataMap: ModelVarMap | null = {};
    tensorData: ModelVar[] = [];

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
        this.subAttrs = op.subAttrs;
        this.name = type;
        this.isPackedOp = isPacked;
        this.bufferType = bufferType;
        this.dataLayout = model.dataLayout || '';
        this.iLayer = iLayer;
        this.isFinalOp = isFinalOp;
        this.uniform = uniform;

        this.initExtendedAttrs(attrs);
        this.constructTensorData(inputs, outputs, model.vars);
        this.buildTensor();
        const shaderParams = this.buildShaderParams();
        this.buildProgram(shaderParams);

    }

    initExtendedAttrs(attrs) {
        for (const key in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                const item = attrs[key];
                this.processedAttrs[key] = item;
            }
        }
    }

    constructTensorData(inputs: OpInputs, outputs: OpOutputs, vars: ModelVar[]) {
        Object.keys(outputs).forEach(key => {
            outputs[key].forEach((name: string, index: number) => {
                outputs[key][index] = this.getTensorVar(name, vars);
            });
        });

        Object.keys(inputs).forEach(key => {
            inputs[key] = [this.getTensorVar(inputs[key][0], vars)];
        });

        for (const key in outputs) {
            if (Object.prototype.hasOwnProperty.call(outputs, key)) {
                try {
                    // 默认取第一个数据
                    const data = outputs[key] || [{}];
                    const tensorName = this.getExactTensorName(key, 'output');
                    if (tensorName) {
                        data.forEach((item: ModelVar, index: number) => {
                            item.tensorName = tensorName;
                            this.tensorDataMap[`${tensorName}_${index}`] = {
                                ...item,
                                tensorName,
                                runtime: index
                            };
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }

        for (const key in inputs) {
            if (Object.prototype.hasOwnProperty.call(inputs, key)) {
                const data = inputs[key].length > 0 ? inputs[key] : [{}];
                // 默认取第一个数据
                const tensorName = this.getExactTensorName(key, 'input');
                if (tensorName) {
                    const tensor = data[0];
                    tensor.tensorName = tensorName;
                    this.tensorDataMap[tensorName] = {
                        ...tensor,
                        tensorName
                    };
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
            mask: 'out',
            boxes: 'out',
            variances: 'out'
        };


        return type === 'input'
            ? intputTensorName[name.toLowerCase()] || name.toLowerCase()
            : outTensorName[name.toLowerCase()];
    }

    getTensorVar(name: string, vars: ModelVar[]) {
        const varName = name.replace(/_packed$/, '');
        const data = findVarByKey(vars, varName);
        if (data && name.endsWith('_packed')) {
            const packedData = Utils.packOpData(data, name);
            return packedData;
        }
        return data;
    }

    buildProgram(shaderParams) {
        const name = this.name;
        const opKey = `${GLOBALS.backend}_${name}`;
        const op = GLOBALS.opRegistry.ops[opKey];
        try {
            if (!op && env.get('backend') !== 'wasm') {
                throw new Error(`[unregistered op] ${name}`);
            }
            const inputTensors = this.inputTensors;
            this.program = this.outputTensors.map((outTensor, index) => GLOBALS.backendInstance.createProgram({
                op,
                outTensor,
                inputTensors,
                shaderParams: shaderParams[index],
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
            else if (this.name.indexOf('max_pool2d_with_index') > -1) {
                this.name = 'pool2d_max';
            }

            // unique behavior
            const opKey = `${GLOBALS.backend}_${this.name}`;
            const behaviorKeys = GLOBALS.opRegistry.ops[opKey]
                ? GLOBALS.opRegistry.ops[opKey].behaviors || []
                : [];
            behaviorKeys.forEach(key => {
                try {
                    opBehaviors[key].call(this);
                }
                catch (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    }

    buildTensor() {
        this.processTensorDataAndAttrs();
        const tensorData = Object.values(this.tensorDataMap);

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
                dataLayout: this.dataLayout,
                runtime: data.runtime || 0
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
        this.tensorDataMap = null;
        this.tensorData = tensorData;
    }

    buildShaderParams() {
        const fShaderParams: object[] = [];
        // 根据out tensor 个数 生成对应的 fShader 个数
        this.outputTensors.forEach(() => {
            const params = JSON.parse(JSON.stringify(this.processedAttrs));
            fShaderParams.push(params);
        });
        return fShaderParams;
    }
}
