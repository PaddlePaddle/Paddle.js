/**
 * @file OpExecutor，封装算子可执行单元
 */

import { ModelOp, OpInputs, OpOutputs, OpAttrs } from '../commons/interface';
import { GLOBALS } from '../globals';

export default class OpExecutor {
    id: string = '';
    type: string = '';
    inputs: OpInputs = {} as OpInputs;
    outputs: OpOutputs = {} as OpOutputs;
    attrs: OpAttrs = {} as OpAttrs;
    subAttrs: OpAttrs[] = [] as OpAttrs[];
    next: string | null = null;
    opData: any = null;
    isPacked: boolean = false;
    finish: boolean = false;

    constructor(op: ModelOp, idx: number, isPacked: boolean | undefined = false) {
        const {
            inputs,
            outputs,
            attrs = {},
            type
        } = op;

        this.id = `${type}_${+new Date()}_${idx}`;
        this.inputs = inputs;
        this.outputs = outputs;
        this.attrs = attrs;
        this.subAttrs = op['sub-attrs'] || [];
        this.type = type;
        this.isPacked = isPacked || false;
        this.finish = false;
        this.next = null;
        this.opData = null;
        this.isPacked = false;

    }

    get inputsName() {
        const opKey = `${GLOBALS.backend}_${this.type}`;
        const opInfo = GLOBALS.opRegistry.ops[opKey];
        if (opInfo && opInfo.inputsName) {
            return opInfo.inputsName.reduce((acc: string[], cur) => acc.concat(this.inputs[cur] || []), []);
        }
        return this.inputs.Input || this.inputs.X;
    }

    get outputsName() {
        const opKey = `${GLOBALS.backend}_${this.type}`;
        const opInfo = GLOBALS.opRegistry.ops[opKey];
        if (opInfo && opInfo.outputsName) {
            return opInfo.outputsName.reduce((acc: string[], cur) => acc.concat(this.outputs[cur] || []), []);
        }
        return this.outputs.Output || this.outputs.Out || this.outputs.Y;
    }

    /**
     * 将输入数据和具体op进行关联，触发执行具体每一个op
     * @param opData op data
     * @param isRendered
     */
    execute(isRendered) {
        if (this.type !== 'feed') {
            GLOBALS.backendInstance.runProgram(this.opData, isRendered);
        }

    }
}
