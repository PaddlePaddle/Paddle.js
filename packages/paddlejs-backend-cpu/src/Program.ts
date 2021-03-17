/**
 * @file webgl program
 * @author yueshuangyan
 */

import { GLOBALS } from '@paddlejs/paddlejs-core/globals';

export default class Program {
    shape?: number[]; // 当前program输出shape
    main: Function;
    outName: string;
    Attrs: object;

    public constructor(opName, outName) {
        try {
            const ops = GLOBALS.opRegistry.ops;
            const op = ops[GLOBALS.backend + '_' + opName];
            this.main = op.main;
            this.outName = outName;
        }
        catch (e) {
            // debugger;
        }
    }
}
