/* eslint-disable */
import Utils from './utils';
/**
 * @file 广播类
 * @author yangmingming
 */
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
// tensor数据
export default class Tensor {
    constructor(opts = {}) {
        this.opts = opts;
        // 设置tensor名字
        this.name = opts.name;
        // tensor的形状
        let shape = this.shape = opts.shape;
        // 图像tensor是否带有batch
        if (opts.needBatch && shape.length === 0) {
            shape.unshift(1);
        }
        // 获取转换到texture后的信息
        let {zeroNumbers, shape: shape_texture} = Utils.getTextureInfoFromTensorShape(shape);
        this.shape_texture = shape_texture;

        // tensor数据
        if (opts.data) {
            // 补充0, 生成数据
            if (zeroNumbers > 0) {
                for (let i = 0; i < zeroNumbers; i++) {
                    opts.data.push(0);
                }

            }
            this.data = new Float32Array(opts.data);
            // 清理缓存
            opts.data.length = 0;
        }

        // todo: delete test data
        let num = this.num = shape.reduce((total, num) => total * num);
        this['numbers_shape_' + opts.name] = this.getShapeNumbers();
        this.data = opts.value || Utils.zeros(num);
        // opts.name是tensor的name
        this.tensorName = opts.name;
        this.textureName = 'texture_' + opts.name;
        // 填充材
        if (opts.type === 'texture') {
            this.tensor = Utils.buildTensor(shape, this.data);
            // 实际存储的
            this.texture_width = this.tensor.w;
            this.texture_height = this.tensor.h;
            this.data = this.tensor.data;
            delete this.tensor;
        } else {
            // test, 计算的shape
            this.texture_width = this.shape[3];
            this.texture_height = this.shape[2];
            this.data = new Float32Array(Utils.tensor2Texture(this.data, this.texture_width * this.texture_height));
            console.dir(['调试数据-图像材质数据', this.data]);
        }
        this['numbers_shape_out'] = [36, 9, 3, 1];
    }

    /**
     * 获取数组下标, shape例子[M, W, H, D]
     * @param pos {Array} tensor坐标索引
     * @return {Number} tensor数据
     */
    getValue(pos = []) {
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

    get name() {
        return this.name;
    }

    get width_texture() {
        return this.shape_texture.width;
    }

    get height_texture() {
        return this.shape_texture.height;
    }

    get width_shape() {
        let length = this.shape.length;
        return this.shape[length - 1];
    }

    get height_shape() {
        let length = this.shape.length;
        return this.shape[length - 2];
    }

    get channel() {
        let length = this.shape.length;
        if (length >= 3) {
            return this.shape[length - 3];
        }
        return 0;
    }

    get length_shape() {
        return this.shape.length || 0;
    }

    /**
     * 获取shape对应的个数
     * @return {Array} 和shape长度相等的对应个数
     */
    get numbers_shape() {
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
