/* eslint-disable */
import Utils from './utils';
/**
 * @file Tensor类
 * @author yangmingming
 */
export default class Tensor {
    constructor(opts = {}) {
        this.opts = opts;
        // 设置tensor名字
        this.name = opts.name;
        // tensor的形状
        let shape = this.shape = opts.shape;
        // 原始数据个数
        this.total = shape.reduce((all, num) => all * num);
        // 图像tensor是否带有batch
        if (opts.needBatch && shape.length < 4) {
            let batch = [];
            for (let i = 0; i < (4 - shape.length); i++) {
                batch.push(1);
            }
            shape = batch.concat(shape);
            this.shape = shape;
        }
        // 获取转换到texture后的信息
        let {zeroNumber, shape: shape_texture} = Utils.getTextureInfoFromTensorShape(shape);
        this.shape_texture = shape_texture;

        // tensor数据
        if (opts.data) {
            // 补充0, 生成数据
            if (zeroNumber > 0) {
                for (let i = 0; i < zeroNumber; i++) {
                    opts.data.push(0);
                }

            }
            // todo: 需要在外层保证data的长度和shape一致
            let total = shape_texture.reduce((all, num) => all * num);
            if (opts.data.length > total) {
                opts.data = opts.data.slice(0, total);
            }
            this.data = new Float32Array(opts.data);
            // 清理缓存
            opts.data.length = 0;
        }
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

    get width_texture() {
        let length = this.shape_texture.length;
        return this.shape_texture[length - 1];
    }

    get height_texture() {
        let length = this.shape_texture.length;
        return this.shape_texture[length - 2];
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

    get total_shape() {
        return this.total;
    }

    dispose() {
        if (this.data) {
            this.data = null;
        }
    }
}
/* eslint-enable */
