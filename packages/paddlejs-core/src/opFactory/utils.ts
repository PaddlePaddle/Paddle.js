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
 * 将nchw排布数据转为nhwc排布数据
 * @param {Array} data tensor data
 * @param {Array} shape nchw
 * @returns {Array} nhwc data
 */
export function nchw2nhwc(data: number[] | Float32Array, shape: number[]): number[] | Float32Array {
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
    return shape;
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
