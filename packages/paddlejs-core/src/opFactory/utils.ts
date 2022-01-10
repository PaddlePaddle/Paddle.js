/**
 * @file op 工具函数
 * @author zhangjingyuan
 */


/**
 * tensor shape 标准化为 4维
 * @param {Array} shape tensor的形状
 * @returns {Array} 4维 shape
 */
export function formatShape(shape: number[]): number[] {
    if (shape.length < 4) {
        const batch: number[] = [];
        for (let i = 0; i < (4 - shape.length); i++) {
            batch.push(1);
        }
        return batch.concat(shape);
    }
    return [...shape];
}

/**
 * calculate total length of shape
 * @param {Array} shape shape of tensor
 * @returns {number} total length of shape
 */
export function accShape(shape: number[]): number {
    return shape.reduce((all, num) => all * num);
}

/**
 * calculate real axis
 * @param {Array} shape shape of tensor
 * @returns {number} real axis after shape format to 4D
 */
export function formatAxis(shape: number[], axis): number {
    const shapeLen = shape.length;
    const axis_temp = axis > -1 ? axis : shapeLen + axis;
    return 4 - shapeLen + axis_temp;
}

/**
 * reshape
 * @param {Array} inputShape input tensor shape
 * @param {Array} outputShape output tensor shape
 * @returns {Array} shape
 */
export function getReshapeInPaddle(inputShape: number[] = [], outShape: number[] = []): number[] {
    const total: number = inputShape.reduce((all, num) => all * num);
    if (outShape.length === 1) {
        return [1, total];
    }
    return [outShape[0], total / outShape[0]];

}

/**
 * pack op data
 *
 * @param {Object} opData - op origin data
 * @param {string} packedName - op packed name
 * @returns {Object} packed data
 */
export function packOpData(opData, packedName) {
    const [b, c, h, w] = opData.shape.length === 3 ? [1, ...opData.shape] : opData.shape;
    const packedOpData = Object.assign({}, opData);
    packedOpData.name = packedName;
    packedOpData.packed = false;
    if (c % 4 === 0) {
        // 紧凑布局
        const packed_c = c / 4;
        packedOpData.packed = true;
        packedOpData.shape = [b, packed_c, h, w];
    }
    return packedOpData;
}


/**
 * 将nchw排布数据转为nhwc排布数据
 * @param {Array} data tensor data
 * @param {Array} shape nchw
 * @returns {Array} nhwc data
 */
function nchw2nhwc(data: number[] | Float32Array, shape: number[]): number[] | Float32Array {
    const [N, C, H, W] = shape;
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

/**
 * 生成 tensor data，如果数据排布为 nhwc 则直接返回 Float32Array，否则进行排布变换
 * @param {Array} data tensor data
 * @param {string} dataLayout layout
 * @param {Array} shape nchw
 * @param {boolean} isPacked
 * @returns {Float32Array} nhwc data
 */
export function genTensorData(data: number[] | Float32Array, dataLayout: string, shape: number[], isPacked: boolean) {
    if (dataLayout === 'nhwc') {
        return new Float32Array(data);
    }
    const [shapeN, shapeC, shapeH, shapeW] = shape;
    const nhwcData: Float32Array | number[] = nchw2nhwc(
        data,
        [shapeN, shapeC * (isPacked ? 4 : 1), shapeH, shapeW]
    );
    return new Float32Array(nhwcData);
}
/**
 * reshape
 *
 * @param {Object} data
 * @param {string} shape
 * @returns {Object} shapedData
 */
export function reshape({ data, shape: originShape }) {
    const shape = [...originShape].reverse();
    let res;
    for (let i = 0, len = shape.length - 1; i < len; i++) {
        const dim = shape[i];
        const cur = !res ? data : res;
        res = splitArr(cur, dim);
    }
    return res;
}

function splitArr(arr, count) {
    const res = [];
    for (let i = 0, len = arr.length; i < len; i += count) {
        res.push(arr.slice(i, i + count));
    }
    return res;
}