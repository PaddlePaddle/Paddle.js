/**
 * @file webgl program
 * @author yueshuangyan
 */

import { GLOBALS } from '@paddlejs/paddlejs-core';

export default class Program {
    shape?: number[]; // 当前program输出shape
    main: Function;
    outName: string;
    Attrs: object;
    runtime: number;

    public constructor(opName, outName, runtime) {
        try {
            const ops = GLOBALS.opRegistry.ops;
            const op = ops[GLOBALS.backend + '_' + opName];
            this.main = op.main as Function;
            this.outName = outName;
            this.runtime = runtime;
        }
        catch (e) {
            // debugger;
        }
    }
}
