/**
 * @file webgl backend
 * @author yueshuangyan
 */

import { PaddlejsBackend } from '@paddlejs/paddlejs-core';
import Program from './Program';
import { OpData } from './types';

export default class CpuBackend extends PaddlejsBackend {
    program?: Program;
    dataMap: object;
    constructor() {
        super();
        this.dataMap = {};
    }

    async init() {
        console.log('init');
    }

    createProgram({ name, outTensor }) {
        const outName = outTensor.tensorId;
        if (!outName) {
            return;
        }
        this.program = new Program(name, outName);
    }

    runProgram(opData: OpData) {
        const program = this.program as Program;
        const data = program.main(opData);
        this.dataMap[program.outName] = data;
    }

    async read({ name }) {
        const data = this.dataMap[name];
        if (!data) {
            console.error('未能预测出结果，请检查预测过程');
        }
        return Array.from(data);
    }

    dispose() {
        this.dataMap = {};
    }
}
