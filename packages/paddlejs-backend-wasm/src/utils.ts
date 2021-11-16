class WasmUtil {
    opWasmBuffer: ArrayBuffer;
    runnerWasmBuffer: ArrayBuffer;
    opWasmMalloc: Function;
    getDataPtr: Function;
    __newString: Function;
    __getArray: Function;
    __getString: Function;
    __new: Function;
    runnerWasmMalloc: Function;
    constructor(opModule, runnerModule) {
        const { buffer: opWasmBuffer, malloc: opWasmMalloc } = opModule;
        this.opWasmBuffer = opWasmBuffer;
        this.opWasmMalloc = opWasmMalloc;
        const { getDataPtr, __newString, memory, __new, __getArray, __getString, heapAlloc } = runnerModule;
        this.runnerWasmBuffer = memory.buffer;
        this.getDataPtr = getDataPtr;
        this.__newString = __newString;
        this.__getArray = __getArray;
        this.__getString = __getString;
        this.__new = __new;
        this.runnerWasmMalloc = heapAlloc;
    }

    read(TypedArray, totalLen, ptr) {
        return new TypedArray(this.runnerWasmBuffer, ptr, totalLen);
    }

    writeShape(shapePtr, len) {
        const shape = this.read(Int32Array, len, shapePtr);
        return this.writeUint8(shape);
    }

    writeUint8(data) {
        try {
            const curData = new Uint8Array(new Int32Array(data).buffer);
            const totalLen = curData.length;
            const ptr = this.malloc(Uint8Array, curData.length);
            const myWasmArray = new Uint8Array(this.opWasmBuffer, ptr, totalLen);
            myWasmArray.set(curData);
            return ptr;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }

    malloc(TypedArray, totalLen) {
        const wasmArrPtr = this.opWasmMalloc(totalLen * TypedArray.BYTES_PER_ELEMENT);
        return wasmArrPtr;
    }

    updateImage(modelIndex, imageData) {
        const ptr = this.getDataPtr(modelIndex, this.__newString('image'));
        const [curPtr, total] = this.__getArray(ptr);
        this.write2Ptr(Float32Array, total, imageData, curPtr);
    }

    writeData(ptr, total) {
        const data = this.read(Float32Array, total, ptr);
        return this.write(Float32Array, total, data);
    }

    rewriteData(ptr, total, shapePtr, shapeLen, nchwDataPtr) {
        const data = this.readXnn(Float32Array, total, ptr);
        const shape = this.read(Int32Array, shapeLen, shapePtr);
        const newData = nhwc2nchw(data, nchw2nhwcShape(shape));
        // const newData = transpose2d(data, shape);
        return this.write2Ptr(Float32Array, total, newData, nchwDataPtr);
    }

    write2Ptr(TypedArray, totalLen, data, ptr) {
        try {
            const myWasmArray = new TypedArray(this.opWasmBuffer, ptr, totalLen);
            const TypedArrayData = new TypedArray(data);
            myWasmArray.set(TypedArrayData);
            return ptr;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }

    write2RunnerPtr(TypedArray, totalLen, data, ptr) {
        try {
            const myWasmArray = new TypedArray(this.runnerWasmBuffer, ptr, totalLen);
            const TypedArrayData = new TypedArray(data);
            myWasmArray.set(TypedArrayData);
            return ptr;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }

    readXnn(TypedArray, totalLen, ptr) {
        return new TypedArray(this.opWasmBuffer, ptr, totalLen);
    }

    mallocFloat32Array(len) {
        return this.opWasmMalloc(len * Float32Array.BYTES_PER_ELEMENT);
    }

    mallocStr(len) {
        return this.__new(len << 1, 1);
    }

    newString(ptr, len, str) {
        // (window as any).heapRealloc(ptr, len * Uint16Array.BYTES_PER_ELEMENT);
        const U16 = new Uint16Array(this.runnerWasmBuffer);
        for (let i = 0, p = ptr >>> 1; i < len; ++i) {
            U16[p + i] = str.charCodeAt(i);
        }
        return ptr;
    }

    newArrayInRunnerModule(TypedArray, arr) {
        const len = arr.length;
        const perSize = TypedArray.BYTES_PER_ELEMENT;
        const ptr = this.runnerWasmMalloc(len * perSize);
        const res = new TypedArray(this.runnerWasmBuffer, ptr, len);
        for (let i = 0; i < len; ++i) {
            res[i] = arr[i];
        }
        return ptr;
    }

    write(TypedArray, totalLen, data) {
        try {
            const ptr = this.malloc(TypedArray, totalLen);
            const myWasmArray = new TypedArray(this.opWasmBuffer, ptr, totalLen);
            const TypedArrayData = new TypedArray(data);
            myWasmArray.set(TypedArrayData);
            return ptr;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }

    writeNhwcShape(shapePtr, len) {
        const shape = this.read(Int32Array, len, shapePtr);
        return this.writeUint8(nchw2nhwcShape(shape));
    }

    genChunkData(data, chunks, inputLen) {
        let curIndex = 0;
        const list = [];
        const origin = [];
        const preheatData = Array.from(new Array(inputLen), () => 1.0);

        const chunkLen = chunks.length;

        for (let i = 0; i < chunkLen; i++) {
            const len = chunks[i];
            const float32Chunk = new Float32Array(data, curIndex * Float32Array.BYTES_PER_ELEMENT, len);
            const curData = len === inputLen && i < 3 ? preheatData : float32Chunk;
            const ptr = this.write(Float32Array, len, curData);
            list.push(ptr);
            origin.push(float32Chunk);
            curIndex += len;
        }
        return list;
    }
}

function download(content, filename) {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};


function nchw2nhwc(data: number[] | Float32Array, shape: number[]): number[] | Float32Array {
    const N = shape[0];
    const C = shape[1];
    const H = shape[2];
    const W = shape[3];
    const HXW = H * W;
    const CXHXW = C * H * W;
    const nhwcData: number[] | Float32Array = [];
    for (let n = 0; n < N; n++) {
        for (let h = 0; h < H; h++) {
            for (let w = 0; w < W; w++) {
                for (let c = 0; c < C; c++) {
                    nhwcData.push(data[n * CXHXW + c * HXW + h * W + w]);
                }
            }
        }
    }
    return nhwcData;
}

function nhwc2nchw(data: number[] | Float32Array, shape: number[]) {
    const N = shape[0];
    const H = shape[1];
    const W = shape[2];
    const C = shape[3];
    const WXC = W * C;
    const HXWXC = H * W * C;
    const nchwData: number[] | Float32Array = [];
    for (let n = 0; n < N; n++) {
        for (let c = 0; c < C; c++) {
            for (let h = 0; h < H; h++) {
                for (let w = 0; w < W; w++) {
                    nchwData.push(data[n * HXWXC + h * WXC + w * C + c]);
                }
            }
        }
    }
    return nchwData;
}

function nchw2chwn(data: number[] | Float32Array, shape: number[]): number[] | Float32Array {
    const N = shape[0];
    const C = shape[1];
    const H = shape[2];
    const W = shape[3];
    const HXW = H * W;
    const CXHXW = C * H * W;
    const nhwcData: number[] | Float32Array = [];
    for (let c = 0; c < C; c++) {
        for (let h = 0; h < H; h++) {
            for (let w = 0; w < W; w++) {
                for (let n = 0; n < N; n++) {
                    nhwcData.push(data[n * CXHXW + c * HXW + h * W + w]);
                }
            }
        }
    }
    return nhwcData;
}

function nhwc2chwn(data: number[] | Float32Array, shape: number[]): number[] | Float32Array {
    const N = shape[0];
    const C = shape[1];
    const H = shape[2];
    const W = shape[3];
    const WXC = W * C;
    const HXWXC = H * W * C;
    const chwnData: number[] | Float32Array = [];
    for (let c = 0; c < C; c++) {
        for (let h = 0; h < H; h++) {
            for (let w = 0; w < W; w++) {
                for (let n = 0; n < N; n++) {
                    chwnData.push(data[n * HXWXC + h * WXC + w * C + c]);
                }
            }
        }
    }
    return chwnData;
}

function reshapeTo2D(src, num_col_dims) {
    const n = src[0];
    const c = src[1];
    // 小于等于二维
    if (n === 1 && c === 1) {
        return [
            src[2],
            src[3]
        ];
    }

    const part1 = src.slice(0, num_col_dims);
    const part2 = src.slice(num_col_dims);

    return [
        part1.reduce((all, num) => all * num, 1),
        part2.reduce((all, num) => all * num, 1)
    ];
}

function transpose2d(data, shape) {
    const [d0, d1] = shape;
    const newData = new Float32Array(data.length);
    for (let i = 0; i < d1; i++) {
        for (let j = 0; j < d0; j++) {
            newData[j * d1 + i] = data[i * d0 + j];
        }
    }
    return newData;
}

function nchw2nhwcShape(shape) {
    const [w = 1, h = 1, c = 1, n = 1] = [...shape].reverse();
    return [n, h, w, c];
}

export {
    WasmUtil,
    nchw2nhwcShape,
    transpose2d,
    reshapeTo2D,
    nchw2chwn,
    nhwc2nchw,
    nhwc2chwn,
    nchw2nhwc,
    download
};

