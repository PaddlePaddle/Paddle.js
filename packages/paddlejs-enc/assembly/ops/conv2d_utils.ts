import * as console from "../helper/outConsole";
class PadInfo {
    top: i32;
    left: i32;
}
class ComputeConv2DInfo {
    batchSize: i32;
    inHeight: i32;
    inWidth: i32;
    inChannels: i32;
    outHeight: i32;
    outWidth: i32;
    outChannels: i32;
    padInfo: PadInfo;
    strideHeight: i32;
    strideWidth: i32;
    filterHeight: i32;
    filterWidth: i32;
    effectiveFilterHeight: i32;
    effectiveFilterWidth: i32;
    dilationHeight: i32;
    dilationWidth: i32;
    originShape: i32[];
    outShape: i32[];
    filterShape: i32[];
}

function convertShapeFromNchw2Nhwc(shape: i32[]): i32[] {
    const n = shape[0];
    const c = shape[1];
    const h = shape[2];
    const w = shape[3];
    return [n, h, w, c];
}

function getEffectiveFilterSize(filterSize: i32, dilation: i32): i32 {
    if (dilation <= 1) {
        return filterSize;
    }
    return filterSize + (filterSize - 1) * (dilation - 1);
}

function computeConv2DInfo(
    originShape: i32[],
    filterShape: i32[],
    outShape: i32[],
    strides: i32[],
    dilations: i32[],
    paddings: i32[]): ComputeConv2DInfo {

    let batchSize = originShape[0] || -1;
    let inChannels = originShape[1] || -1;
    let inHeight = originShape[2] || -1;
    let inWidth = originShape[3] || -1;

    const filterHeight = filterShape[2];
    const filterWidth = filterShape[3];
    const strideWidth = strides[0];
    const strideHeight = strides[1];
    const dilationWidth = dilations[0];
    const dilationHeight = dilations[1];

    const effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    const effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);

    const padInfo = { top: paddings[0], left: paddings[1] } as PadInfo;

    const outChannels = outShape[1];
    const outHeight = outShape[2];
    const outWidth = outShape[3];

    return {
        batchSize,
        inHeight,
        inWidth,
        inChannels,
        outHeight,
        outWidth,
        outChannels,
        padInfo,
        strideHeight,
        strideWidth,
        filterHeight,
        filterWidth,
        effectiveFilterHeight,
        effectiveFilterWidth,
        dilationHeight,
        dilationWidth,
        originShape: convertShapeFromNchw2Nhwc(originShape),
        outShape: convertShapeFromNchw2Nhwc(outShape),
        filterShape: convertShapeFromNchw2Nhwc(filterShape)
    } as ComputeConv2DInfo;
}

function sizeFromShape(shape: i32[]): i32 {
    if (shape.length == 0) {
        // Scalar.
        return 1;
    }
    let size = shape[0];
    for (let i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}

function computeStrides(shape: i32[]): i32[] {
    const rank = shape.length;
    if (rank < 2) {
        return [];
    }

    // Last dimension has implicit stride of 1, thus having D-1 (instead of D)
    // strides.
    const strides = new Array<i32>(rank - 1);
    strides[rank - 2] = shape[rank - 1];
    for (let i = rank - 3; i >= 0; --i) {
        strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
}

class TensorBuffer {
    size: i32;
    shape: i32[];
    strides: i32[];
    values: f32[];

    constructor(shape: i32[]) {
        this.shape = shape;
        this.size = sizeFromShape(shape);
        this.values = new Array<f32>(this.size);
        this.strides = computeStrides(shape);
    }

    /**
     * Sets a value in the buffer at a given location.
     *
     * @param value The value to set.
     * @param locs  The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    set(value: f32, ...locList: i32[]): void {
        if (locList.length === 0) {
            locList = [0];
        }
        const index = this.locToIndex(locList);
        this.values[index] = value;
    }

    /**
     * Returns the value in the buffer at the provided location.
     *
     * @param locs The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    get(...locList: i32[]): f32 {
        if (locList.length === 0) {
            locList = [0];
        }
        let i = 0;
        locList.forEach((loc, index) => {
            if (loc < 0 || loc >= this.shape[i]) {
                const msg = `Requested out of range element at ${locList}.
                        Buffer shape=${this.shape}`;
                throw new Error(msg);
            }
            i++;
        });
        let index = locList[locList.length - 1];
        for (let i = 0; i < locList.length - 1; ++i) {
            index += this.strides[i] * locList[i];
        }
        return this.values[index];
    }

    locToIndex(locs: i32[]): i32 {
        if (this.rank === 0) {
            return 0;
        }
        else if (this.rank === 1) {
            return locs[0];
        }
        let index = locs[locs.length - 1];
        for (let i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return index;
    }

    indexToLoc(cur: i32): i32[] {
        let index = cur;
        if (this.rank === 0) {
            return [];
        }
        else if (this.rank === 1) {
            return [index];
        }
        const locs: i32[] = new Array<i32>(this.shape.length);
        for (let i = 0; i < locs.length - 1; ++i) {
            locs[i] = Math.floor(index / this.strides[i]);
            index -= locs[i] * this.strides[i];
        }
        locs[locs.length - 1] = index;
        return locs;
    }

    get rank(): i32 {
        return this.shape.length;
    }

    /**
     * Creates an immutable `tf.Tensor` object from the buffer.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
}

export {
    convertShapeFromNchw2Nhwc,
    computeConv2DInfo,
    computeStrides,
    TensorBuffer
}