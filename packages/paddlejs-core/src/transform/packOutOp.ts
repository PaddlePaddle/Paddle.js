/**
 * @file nhwc 2 nchw & pack out
 */

import env from '../env';
import { ModelOp, ModelVar } from '../commons/interface';
import { formatShape } from '../opFactory/utils';
import Transformer from './transformer';

const FINAL_PACK_OP_NAME = 'fetch_pack';
const FINAL_NCHW_OP_NAME = 'final_nchw';

export default class Fetch extends Transformer {
    constructor() {
        super('Fetch');
    }

    transform(...args: any) {
        if (!env.get('webgl_pack_output')) {
            return;
        }
        const [ops, vars] = args;
        const fetchOp = ops.find(item => item.type === 'fetch');
        const [inputName] = fetchOp.inputs.X;
        const fetchInputVar = vars.find(item => item.name === inputName);
        const [n, h, w, c] = formatShape(fetchInputVar.shape);

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

        const changed_fetch_name = `${inputName}_fetch`;
        fetchOp.inputs.X = [changed_fetch_name];
        // save origin fetch op info
        const changedFetchVar: ModelVar = {
            name: changed_fetch_name,
            shape: fetchInputVar.shape,
            persistable: false
        };

        ops.push(...[nchwOp, packOutOp]);
        vars.push(...[nchwVar, packOutVar, changedFetchVar]);
    }
}

