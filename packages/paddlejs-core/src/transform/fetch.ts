/**
 * @file WebGL Fetch
 */

import Transformer from './transformer';
import { ModelOp } from '../commons/interface';

const FINAL_OP_NAME = 'final';
export default class Fetch extends Transformer {
    constructor() {
        super('Fetch');
    }

    transform(...args: any) {
        const [ops, vars] = args;
        const fetchOp = ops.find(item => item.type === 'fetch');
        console.log(fetchOp);
        const [inputName] = fetchOp.inputs.X;
        const finalOp: ModelOp = {
            attrs: {},
            inputs: {
                X: [inputName]
            },
            outputs: {
                Y: [FINAL_OP_NAME]
            },
            type: 'final'
        };
        fetchOp.inputs.X = [FINAL_OP_NAME];
        // fetchOp.outputs.Out = [FINAL_OP_NAME];
        ops.push(finalOp);
        const fetchInputVar = vars.find(item => item.name === inputName);
        console.log(fetchInputVar.shape);
        const [n, h, w, c] = fetchInputVar.shape;
        const finalVar = {
            name: FINAL_OP_NAME,
            shape: [n, c, h, w],
            persistable: false
        };
        vars.push(finalVar);
    }
}
