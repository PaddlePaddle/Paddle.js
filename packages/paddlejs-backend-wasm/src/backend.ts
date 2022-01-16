/**
 * @file webgl backend
 * @author yueshuangyan
 */

import { PaddlejsBackend, env } from '@paddlejs/paddlejs-core';
import type OpExecutor from '@paddlejs/paddlejs-core/src/opFactory/opExecutor';
import { WasmMemoryType } from '@paddlejs/paddlejs-core/commons/interface';
import { RunnerConfig } from './types';
import { download, nchw2chwn, nhwc2chwn, nchw2nhwc, nhwc2nchw } from './utils';
import Wasm from './wasm';


export default class WasmBackend extends PaddlejsBackend {
    wasm: Wasm;
    total: number; // 模型总数
    cur: number; // 当前模型index
    modelConfigList: RunnerConfig[];
    modelTimeList: number[];
    constructor() {
        super();
        this.modelConfigList = [];
        this.total = -1; // 共注册的模型数目
        this.cur = -1; // 当前是哪个模型
        env.set('backend', 'wasm');
    }

    async init() {
        // 多个模型并行加载，wasm只初始化一次
        await Promise.all([this.initForFirstTime(), this.initSubsequently()]);
    }

    async initForFirstTime() {
        if (!this.wasm) {
            const wasm = new Wasm();
            this.wasm = wasm;
            await wasm.load(WasmMemoryType.memory100);
        }
    }

    async initSubsequently() {
        let timer;
        return new Promise(resolve => {
            timer = setInterval(() => {
                if (this.wasm.loaded) {
                    resolve(true);
                    clearInterval(timer);
                };
            }, 10);
        });
    }

    initWasm(modelConfig?: RunnerConfig, weightMap?: OpExecutor[]): number {
        this.total++;
        const cur = this.total;
        modelConfig.index = cur;
        this.modelConfigList.push(modelConfig);
        const modelInfo = this.genGraphContentStr(weightMap, modelConfig.dataLayout);
        this.wasm.init(modelInfo, cur);
        return cur;
    }

    async predict(imageData, index: number) {
        if (imageData) {
            // 写入imageData
            this.wasm.wasmUtil.updateImage(index, imageData);
        }
        this.cur = index;
        // 获取图片数据
        this.wasm.runnerModule.run(index);
    }

    async read(fetchInfo) {

        const index = fetchInfo.index;
        const curModelConfig = this.modelConfigList[index];
        const {
            multiOutputs
        } = curModelConfig;

        let result = [];

        if (multiOutputs) {
            // 取出data
            for (const output of multiOutputs) {
                const { name, shape } = output;
                const data = this.readOpData(index, name);
                const [W = 1, H = 1, C = 1, N = 1] = shape.reverse();
                const nchwData = nhwc2nchw(data, [N, H, W, C]);
                result.push(nchwData);
            }
            return result;
        }

        const { name, shape } = fetchInfo;
        result = this.readOpData(index, name);

        // convert to nchw
        const [W = 1, H = 1, C = 1, N = 1] = shape.reverse();
        return nhwc2nchw(result, [N, H, W, C]);
    }

    readOpData(modelIndex, name) {
        const { getDataPtr, __newString, __getArray } = this.wasm.runnerModule;
        const ptr = getDataPtr(modelIndex, __newString(name));
        const [curPtr, total] = __getArray(ptr);
        const data = this.wasm.wasmUtil.readXnn(Float32Array, total, curPtr);
        return data;
    }

    downloadOpData(modelIndex, name) {
        const data = this.readOpData(modelIndex, name);
        const str = data.join(',');
        download(str, str.length);
    }

    getExecuteTime(ptr) {
        const list = new Float32Array(this.wasm.runnerModule.memory.buffer, ptr, 1);

        const listLen = list.length;
        const timeSum = list.reduce((acc, cur) => acc + cur);
        const timeAvg = timeSum / listLen;

        const text = document.createElement('div');
        text.innerHTML = timeAvg + '';
        // document.body.appendChild(text);
    }

    genGraphContentStr(weightMap, dataLayout) {
        const isDataNhwc = dataLayout === 'nhwc';
        const tensorOutMap = new Map();
        const dataLenList = [];
        const result = weightMap.filter(op => {
            return op && op.opData && op.opData.tensorData;
        }).map(op => {
            const tensorData = op.opData.tensorData.map(tensor => {
                const { name, tensorName, shape, total } = tensor || {};
                const [w = 1, h = 1, c = 1, n = 1] = [...(tensor?.shape || [])].reverse();
                let length_unformatted_shape = 4;
                let ptr = 0;
                if (tensor.data && tensor.data.length && tensorName !== 'image') {
                    let data = tensor.data = new Float32Array(Array.from(tensor.data, item => Number(item as string)));
                    dataLenList.push(total);

                    // 写内存
                    const opName = op.opData.name;
                    data = opName === 'conv2d_depthwise' && tensorName === 'filter'
                        ? (isDataNhwc ? nhwc2chwn(data, [n, c, h, w]) : nchw2chwn(data, [n, c, h, w])) as Float32Array
                        : (isDataNhwc ? data : nchw2nhwc(data, [n, c, h, w])) as Float32Array;

                    ptr = this.wasm.wasmUtil.write(Float32Array, total, data);

                    length_unformatted_shape = op.opData.inputTensors.filter(
                        inputTensor => inputTensor.name === tensor.tensorName)[0].unformattedShapeLength;

                }

                else if (tensorName === 'out') {
                    tensorOutMap.set(name, 1);
                    length_unformatted_shape = op.opData.outputTensors.filter(
                        inputTensor => inputTensor.name === tensor.tensorName)[0].unformattedShapeLength;

                }
                else if (tensorOutMap.has(name)) {
                    length_unformatted_shape = op.opData.inputTensors.filter(
                        inputTensor => inputTensor.name === tensor.tensorName)[0].unformattedShapeLength;
                }

                const ptrStr = ptr !== undefined ? `##${ptr}` : '';
                const runtime = tensor.runtime || 0;

                return `${name}##${shape.join('#$')}##${tensorName}##${total}`
                    + `##${length_unformatted_shape}##${runtime}${ptrStr}`;
            });

            const tensorDataStr = tensorData.join('#@');
            const attrs = op.opData.processedAttrs;

            const opName = op.opData.name;
            if (opName === 'conv2d_depthwise') {
                attrs.is_depthwise = 1;
                op.opData.name = 'conv2d';
            }
            const attrsStr = Object.keys(attrs).map(key => {
                const item = attrs[key];
                const value = item instanceof Array ? item.join('#$') : item;
                return `${key}:${value}`;
            }).join('##');
            return `${op.opData.name}#!${tensorDataStr}#!${attrsStr}`;
        });

        return ['no#' + result.join('#~'), dataLenList];
    }

    createProgram() {
        // 初始化
    }

    runProgram() {
    }

    dispose() {
    }
}
