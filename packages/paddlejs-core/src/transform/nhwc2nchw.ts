/**
 * @file add gpu pipe unit nhwc2nchw
 */

import env from '../env';
import { ModelOp } from '../commons/interface';
import { findVarByKey, AddItemToVars } from '../commons/utils';
import { formatShape } from '../opFactory/utils';
import Transformer from './transformer';

const FINAL_NCHW_OP_NAME = 'final_nchw';

export default class nhwc2nchw extends Transformer {
    constructor() {
        super('NHWC2NCHW');
    }

    transform(...args: any) {
        if (!env.get('webgl_gpu_pipeline')) {
            return;
        }
        const [ops, vars] = args;
        const fetchOp = ops.find(item => item.type === 'fetch');
        const [inputName] = fetchOp.inputs.X;
        const fetchInputVar = findVarByKey(vars, inputName);
        const [n, c, h, w] = formatShape(fetchInputVar.shape);

        // transform data from nhwc to nchw
        const nchwOp: ModelOp = {
            attrs: {},
            inputs: {
                X: [inputName]
            },
            outputs: {
                Y: [FINAL_NCHW_OP_NAME]
            },
            type: 'nhwc_2_nchw'
        };

        // make nchw op var
        const nchwVar = {
            name: FINAL_NCHW_OP_NAME,
            shape: [n, c, h, w],
            persistable: false,
            interpType: 'LINEAR'
        };


        fetchOp.inputs.X = [FINAL_NCHW_OP_NAME];
        ops.push(...[nchwOp]);
        AddItemToVars(vars, nchwVar);
    }
}