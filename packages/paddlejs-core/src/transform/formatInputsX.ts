/**
 * @file FormatInputsX
 */

import Transformer from './transformer';

export default class FormatInputsX extends Transformer {
    constructor() {
        super('FormatInputsX');
    }

    transform(...args: any) {
        const [originOp] = args;

        const transformOpList = ['concat', 'connect', 'fc', 'rnn_origin', 'rnn_matmul'];
        if (!transformOpList.includes(originOp.type)) {
            return;
        }

        const {
            inputs
        } = originOp;

        if ((originOp.type === 'rnn_origin' || originOp.type === 'rnn_matmul') && inputs.WeightList.length > 0) {
            inputs.WeightList.forEach((item, index) => {
                inputs[`weightlist_${index}`] = [item];
            });
            return;
        }

        const inputsX = inputs.X || inputs.Input;
        // 兼容key为X,value是个长度大于1的数组的情况，如concat
        if (inputsX.length > 1) {
            inputsX.forEach((item, index) => {
                inputs[`origin${index > 0 ? `_${index}` : ''}`] = [item];
            });
            delete inputs.X;
            delete inputs.Input;
        }
    }
}