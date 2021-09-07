/**
 * @file nhwc 2 nchw & pack out
 */

import env from '../env';
import { ModelOp } from '../commons/interface';
import { findVarByKey, AddItemToVars } from '../commons/utils';
import { formatShape } from '../opFactory/utils';
import Transformer from './transformer';

const FINAL_PACK_OP_NAME = 'fetch_pack';
const FINAL_NCHW_OP_NAME = 'final_nchw';

export default class PackOut extends Transformer {
    constructor() {
        super('PackOut');
    }

    transform(...args: any) {
        if (!env.get('webgl_pack_output')) {
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

        // pack out texture
        const packOutOp: ModelOp = {
            attrs: {},
            inputs: {
                X: [FINAL_NCHW_OP_NAME]
            },
            outputs: {
                Y: [FINAL_PACK_OP_NAME]
            },
            type: 'pack_out'
        };

        // make nchw op var
        const nchwVar = {
            name: FINAL_NCHW_OP_NAME,
            shape: [n, c, h, w],
            persistable: false
        };

        const pack_width = c * w;
        const pack_height = Math.ceil(n * h / 4);
        // make pack op var
        const packOutVar = {
            name: FINAL_PACK_OP_NAME,
            shape: [1, 1, pack_height, pack_width],
            persistable: false
        };

        fetchOp.inputs.X = [FINAL_PACK_OP_NAME];
        fetchOp.attrs['origin_shape'] = [n, c, h, w];
        ops.push(...[nchwOp, packOutOp]);
        AddItemToVars(vars, [nchwVar, packOutVar]);
    }
}

