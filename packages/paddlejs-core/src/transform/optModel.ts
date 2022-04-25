import { findVarByKey } from '../commons/utils';
import Transformer from './transformer';


export default class OptModel extends Transformer {
    constructor() {
        super('OptModel');
    }

    transform(...args: any) {
        const [ops, vars] = args;
        for (let opIndex = 0; opIndex < ops.length; opIndex++) {
            const op = ops[opIndex];

            // todo：这样取可能有问题
            let curInputName = '';
            if ((op.type === 'size' && ops[opIndex + 1].type === 'cast') || op.type === 'shape') {
                curInputName = op.inputs.Input
                    ? op.inputs.Input[0]
                    : op.inputs.X[0];
            }

            // 当size、cast算子连续使用的时候，把size和cast算子剔除，直接计算cast的输出
            if (op.type === 'size' && ops[opIndex + 1].type === 'cast') {
                const currentOpName = ops[opIndex + 1].outputs.Out[0];
                const inputVar = findVarByKey(vars, curInputName);
                const total = inputVar.shape.reduce((pre, cur) => pre * cur);
                const outputVar = findVarByKey(vars, currentOpName);
                outputVar.data = [total];
                outputVar.persistable = true;
                ops.splice(opIndex, 1);
                ops.splice(opIndex, 1);
                opIndex = opIndex - 1;
            }
            else if (op.type === 'shape') {
                const curOutputName = op.outputs.Out[0];
                const inputVar = findVarByKey(vars, curInputName);
                const outputVar = findVarByKey(vars, curOutputName);
                const inputShape = inputVar.shape;
                outputVar.data = inputShape;
                outputVar.persistable = true;

                ops.splice(opIndex, 1);
                opIndex = opIndex - 1;
            }

        }
    }

}
