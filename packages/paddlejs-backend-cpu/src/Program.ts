/**
 * @file webgl program
 * @author yueshuangyan
 */

import { ops } from './ops';

export default class Program {
    shape?: number[]; // 当前program输出shape
    main: Function;
    outName: string;

    public constructor(opName, outName) {
        const { mainFunc } = ops[opName];
        this.main = mainFunc;
        this.outName = outName;
    }
}
