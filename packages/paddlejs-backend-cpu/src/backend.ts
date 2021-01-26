/**
 * @file webgl backend
 * @author yueshuangyan
 */

import { PaddlejsBackend } from '@paddlejs/paddlejs-core';
import Program from './Program';
import { OpData } from './types';

export default class CpuBackend extends PaddlejsBackend {
    program?: Program;
    dataMap?: Map<string, number[]>;
    constructor() {
        super();
        this.dataMap = new Map();
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

        // get out tensor data of prev layers from dataMap
        // for (const tensor of opData.tensorData) {
        //     const { data, name } = tensor;
        //     if (!data && this.dataMap[name]) {
        //         tensor.data = this.dataMap[name];
        //     }
        // }
        // @ts-ignore
        program.main(new Obj(opData), this.dataMap);
        // this.dataMap[program.outName] = data;
    }

    async read({ name }) {
        const data = this.dataMap.get(name);
        if (!data) {
            console.error('未能预测出结果，请检查预测过程');
        }
        return Array.from(data);
    }

    dispose() {
        this.dataMap = null;
    }
}
