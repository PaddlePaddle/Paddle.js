/**
 * @file 广播类
 * @author yangmingming
 */
import Utils from './utils';

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
        this.sx = opts.sx || 1;
        this.sy = opts.sy || 1;
        this.depth = opts.depth || 1;
        let num = this.sx * this.sy * this.depth;
        this.data = Utils.zeros(num);
        /*let j = 0.0;
        for (let i = 0; i < num; i++) {
            // this.data[i] = Utils.randomFloat();
            if (i % 4 === 0) {
                j += 1.0;
            }
            this.data[i] = j;
        }*/
    }
    get(x, y, d) {
        let index = ((this.sx * y) + x) * this.depth + d;
        return this.data[index];
    }
}

