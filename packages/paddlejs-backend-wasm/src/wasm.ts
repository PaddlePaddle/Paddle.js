/**
 * @file webgl backend
 * @author yueshuangyan
 */

import { instantiate } from '@assemblyscript/loader';
// libWebGLExample
import WasmBackendModule from '../assets/kernelWasm.js';
import { WasmUtil } from './utils';
import { WasmMemoryType } from './types';

const wasmRunnerPath = 'runtime.wasm';

interface WasmModule {
    malloc: Function;
    free: Function;
    memory: WebAssembly.Memory;
    buffer: ArrayBuffer;
    module: WebAssembly.Module;
    exports?: any;
}

export default class Wasm {
    opModule: WasmModule;
    runnerModule: any;
    tbl: WebAssembly.Table;
    wasmUtil: WasmUtil;
    prefixUrl: string;
    noLayout: boolean;
    loaded: boolean;
    constructor() {
        this.tbl = new WebAssembly.Table({
            initial: 1500,
            element: 'anyfunc'
        });
        this.prefixUrl = 'https://paddlejs.cdn.bcebos.com/dist/wasm';
        this.noLayout = true;
        this.loaded = false;
    }

    async load(wasmMemoryType: WasmMemoryType) {
        const memorySize = Number(wasmMemoryType) * 16;
        const memory = new WebAssembly.Memory({ initial: memorySize, maximum: memorySize });
        const [kernelWasm, runnerWasm] = await this.loadWasmsFiles(memory, wasmMemoryType);
        await Promise.all([this.loadKernelWasm(kernelWasm, memory), this.loadRunnerWasm(runnerWasm)]);
        this.wasmUtil = new WasmUtil(this.opModule, this.runnerModule);
        this.loaded = true;
    }

    async loadWasmsFiles(memory, wasmMemoryType: WasmMemoryType) {
        const filePath = `${this.prefixUrl}/kernel${wasmMemoryType}.wasm`;
        return Promise.all([
            WasmBackendModule(filePath, memory),
            this.fetchRunnerWasm()
        ]).then(list => list);
    }

    async loadKernelWasm(res, memory) {
        // const res = await WasmBackendModule();
        const asm = res.asm;
        const { malloc, free } = asm;
        // todo 此wasm memory 在 kernalWasm的loader js中声明的，后续需要将两个loader合并
        this.opModule = { module, malloc, memory, free, buffer: memory.buffer, exports: asm };

        // kernalWasm init
        asm.init();

        // table init
        this.initOpTable(asm);
    }

    async fetchRunnerWasm() {
        const source = await fetch(`${this.prefixUrl}/${wasmRunnerPath}`, {
        // const source = await fetch(`assets/${wasmRunnerPath}`, {
            headers: {
                'Content-Type': 'application/wasm'
            }
        });
        const arrayBuffer = await source.arrayBuffer();
        return arrayBuffer;
    }

    async loadRunnerWasm(arrayBuffer) {
        const me = this;
        const importObj = {
            outConsole: {
                log(messagePtr) {
                    console.log(me.runnerModule.__getString(messagePtr));
                },
                time(labelPtr) {
                    console.time(me.runnerModule.__getString(labelPtr));
                },
                timeEnd(labelPtr) {
                    console.timeEnd(me.runnerModule.__getString(labelPtr));
                },
                writeShape(shape, len) {
                    return me.wasmUtil.writeShape(shape, len);
                },
                readXnnData(ptr, len, type) {
                    // 0 是int 1是float
                    const data = me.wasmUtil.readXnn(type === 1 ? Float32Array : Int32Array, len, ptr);
                    console.log(data);
                },
                writeNhwcShape(shape, len) {
                    return me.wasmUtil.writeNhwcShape(shape, len);
                },
                rewriteData(dataPtr, dataLen, shapePtr, shapeLen, nchwDataPtr) {
                    return me.wasmUtil.rewriteData(dataPtr, dataLen, shapePtr, shapeLen, nchwDataPtr);
                },
                writeData(dataPtr, dataLen) {
                    return me.wasmUtil.writeData(dataPtr, dataLen);
                },
                mallocFloat32Array(len) {
                    return me.wasmUtil.mallocFloat32Array(len);
                },
                downloadOpData(modelIndex, name) {
                    const { getDataPtr, __getArray } = me.runnerModule;
                    const ptr = getDataPtr(modelIndex, name);
                    const [curPtr, total] = __getArray(ptr);
                    const data = me.wasmUtil.readXnn(Float32Array, total, curPtr);
                    console.log(data);
                }
            },
            env: {
                table: this.tbl
            }
        };

        const m = await instantiate(arrayBuffer, importObj);
        this.runnerModule = m.exports;
    }

    initOpTable(asm) {
        const tbl = this.tbl;
        const {
            run_conv2d,
            run_add,
            run_pool2d,
            run_softmax,
            run_relu,
            run_mul,
            copy,
            run_batchnorm,
            run_dynamic,
            run_concat,
            run_transpose,
            run_box_coder,
            run_density_prior_box,
            run_reshape,
            nhwc2nchwData,
            nchw2nhwcData,
            transpose2d
        } = asm;

        const opList: Function[] = [
            run_conv2d,
            run_add,
            run_pool2d,
            run_softmax,
            run_relu,
            run_mul,
            copy,
            run_batchnorm,
            run_dynamic,
            run_concat,
            copy,
            copy,
            run_transpose,
            run_box_coder,
            run_density_prior_box,
            run_reshape,
            nhwc2nchwData,
            nchw2nhwcData,
            transpose2d
        ];

        let startIndex = 416;
        for (const op of opList) {
            tbl.set(startIndex, op);
            startIndex++;
        }
    }

    async init(modelInfo, index) {
        const [graphContentStr, chunkList] = modelInfo;

        const { __newString } = this.runnerModule;
        const len = graphContentStr.length;

        const chunkDataPtr = this.wasmUtil.newArrayInRunnerModule(Int32Array, chunkList);
        const modelPtr = __newString(graphContentStr);
        const timePtr = this.runnerModule.init(
            index,
            modelPtr,
            len,
            chunkDataPtr,
            chunkList.length,
            0, // keyPtr
            0, // 内存复用
            0, // 输出layer
            0 // encMode, 0为不加密
        );
        return timePtr;
    }

    dispose() {
    }
}
