import Utils from './utils';
/**
 * @file 广播类
 * @author yangmingming
 */
/* eslint-disable */
export function getBroadcastDims(inShape = [], outShape = []) {
    const inRank = inShape.length;
    const dims = [];
    for (let i = 0; i < inRank; i++) {
        const dim = inRank - 1 - i;
        const a = inShape[dim] || 1;
        const b = outShape[outShape.length - 1 - i] || 1;
        if (b > 1 && a === 1) {
            dims.unshift(dim);
        }
    }
    return dims;
};

export function getBroadcastShape(shapeA = [], shapeB = []) {
    const result = [];
    const max = Math.max(shapeA.length, shapeB.length);
    for (let i = 0; i < max; i++) {
        let a = shapeA[shapeA.length - i - 1];
        if (a === null) {
            a = 1;
        }
        let b = shapeB[shapeB.length - i - 1];
        if (b === null) {
            b = 1;
        }
        if (a === 1) {
            result.unshift(b);
        } else if (b === 1) {
            result.unshift(a);
        } else if (a !== b) {
            return null;
        } else {
            result.unshift(a);
        }
    }
    return result;
};
// matrix数据
export default class Matrix {
    constructor(opts = {}) {
        let shape = this.shape = opts.shape;
        let num = this.num = shape.reduce((total, num) => total * num);
        this.shapeNumbers = this.getShapeNumbers();
        this.data = opts.value || Utils.zeros(num);
        // 填充材质
        if (opts.type === 'texture') {
            this.tensor = Utils.buildTensor(shape, this.data);
            // 实际存储的
            this.texture_width = this.tensor.w;
            this.texture_height = this.tensor.h;
            this.data = this.tensor.data;
        }
        // test, 计算的shape
        this.sy = this.shape[1];
        this.sx = this.shape[2];
    }

    /**
     * 获取数组下标, shape例子[M, W, H, D], D的索引从1开始，其他从0开始
     * @param pos {Array} tensor坐标索引
     * @return {Number} tensor数据
     */
    get(pos = []) {
        let p = [].concat(pos);
        let len = p.length;
        let sLen = this.shape.length;
        // 补齐
        for (let i = 0; i < (sLen - len); i++) {
            p.unshift(0);
        }
        let index = 0;
        for (let i = 0; i < sLen; i++) {
            index += p[i] * this.shapeNumbers[i];
        }
        return this.data[index];
    }

    /**
     * 获取shape对应的个数
     * @return {Array} 和shape长度相等的对应个数
     */
    getShapeNumbers() {
        let numbers = [];
        let sLen = this.shape.length;
        for (let i = 0; i < (sLen - 1); i++) {
            let number = this.shape.slice(i + 1).reduce((total, num) => total * num);
            numbers.push(number);
        }
        // 和shape长度保持一致
        numbers.push(1);
        return numbers;
    }
}
/* eslint-enable */
