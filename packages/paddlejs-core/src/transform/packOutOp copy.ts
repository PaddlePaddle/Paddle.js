/**
 * @file pack out op
 */

import Transformer from './transformer';
import { ModelOp, ModelVar } from '../commons/interface';
import { formatShape } from '../opFactory/utils';
import env from '../env';

const FINAL_PACK_OP_NAME = 'fetch_pack';

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

        const packOutOp: ModelOp = {
            attrs: {},
            inputs: {
                X: [inputName]
            },
            outputs: {
                Y: [FINAL_PACK_OP_NAME]
            },
            type: 'pack_out'
        };

        ops.push(packOutOp);

        const fetchInputVar = vars.find(item => item.name === inputName);

        const changed_fetch_name = `${inputName}_fetch`;
        fetchOp.inputs.X = [changed_fetch_name];
        const changedFetchVar: ModelVar = {
            name: changed_fetch_name,
            shape: fetchInputVar.shape,
            persistable: false
        };
        const [n, c, h, w] = formatShape(fetchInputVar.shape);
        const pack_width = c * w;
        const pack_height = Math.ceil(n * h / 4);
        const packOutVar = {
            name: FINAL_PACK_OP_NAME,
            shape: [1, 1, pack_height, pack_width],
            persistable: false
        };
        vars.push(...[packOutVar, changedFetchVar]);
    }
}

