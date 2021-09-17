/**
 * @file op 工具函数
 * @author zhangjingyuan
 */

import { GLOBALS } from '../globals';

/**
 * 获取texture形状和补0个数
 * @param {Array} shape tensor的形状
 * @param {boolean} isPacked 是否是packed op
 * @returns {Object} texture信息
 */
export function getTextureInfoFromTensorShape(shape: number[] = [], isPacked = false) {
    const GPU_TEXTURE_MAX_SIZE = GLOBALS.backendInstance.MAX_TEXTURE_SIZE || 4096;
    const b = shape[0];
    const c = shape[1];
    const h = shape[2];
    const w = shape[3];
    let height = b * h;
    let width = c * w;

    // 安卓和ios的max texture size是4096, 改造存储空间(4bh, cw / 4)
    let exceedMax = false;
    if (isPacked) {
        const packed_c = c;
        const zeroNumber = height * packed_c * w * 4 - height * width;
        return {
            exceedMax,
            shape: [4, height, width],
            packedShape: [b, packed_c, h, w],
            packedTextureShape: [4, height, packed_c * w],
            zeroNumber
        };
    }
    // trick TEXTURE_SIZE 超限问题，后续升级更优解
    if (height > GPU_TEXTURE_MAX_SIZE || width > GPU_TEXTURE_MAX_SIZE) {
        console.error('大小超限', shape);
        height *= 4;
        width = c * (Math.ceil(w / 4));
        exceedMax = true;
        if (height > GPU_TEXTURE_MAX_SIZE || width > GPU_TEXTURE_MAX_SIZE) {
            const requested = `[${width}x${height}]`;
            const max = `[${GPU_TEXTURE_MAX_SIZE}x${GPU_TEXTURE_MAX_SIZE}]`;
            throw new Error(
                'Requested texture size ' + requested
                + ' greater than WebGL maximum on this browser / GPU ' + max + '.');
        }
    }

    return {
        exceedMax,
        shape: [4, height, width],
        zeroNumber: 0
    };
}


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
    const nhwcData: Float32Array | number[] = nchw2nhwc(
        data,
        [shape[0], shape[1] * (isPacked ? 4 : 1), shape[2], shape[3]]
    );
    return new Float32Array(nhwcData);
}