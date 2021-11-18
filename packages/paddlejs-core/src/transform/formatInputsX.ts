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

        if (originOp.type !== 'concat'
        && originOp.type !== 'connect'
        && originOp.type !== 'rnn_origin'
        && originOp.type !== 'rnn_matmul'
        ) {
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

        if (inputs.X.length > 4) {
            throw Error('Not yet supporting concat input tensors more than 4.');
        }
        if (inputs.X.length > 1) {
            // 兼容key为X,value是个长度大于1的数组的情况，如concat
            const [x_name, y_name, z_name, m_name] = inputs.X;
            inputs['X'] = [x_name];
            y_name && (inputs['Y'] = [y_name]);
            if (z_name) {
                inputs['Z'] = [z_name];
                originOp.type += '_mul';
            }
            if (m_name) {
                inputs['M'] = [m_name];
            }
        }
    }
}

