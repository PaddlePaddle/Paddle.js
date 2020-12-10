
/**
 * @file Tensor类
 */

import * as Utils from './utils';

export default class Tensor {
    opts: any = {};
    packedData: Float32Array | number[] = [];
    isPacked: boolean = false;
    name: string = '';
    tensorId: string = '';
    total: number = 1;
    shape: number[] = [];
    shape_texture: number[] = [];
    shape_texture_packed: number[] = [];
    shape_packed: number[] = [];
    exceedMax: boolean = false;
    data: Float32Array | number[] | null = null;

    constructor(opts: any = {}) {
        this.opts = opts;
        this.packedData = [];
        // 数据存储方式
        this.isPacked = opts.isPacked || false;
        // 设置tensor名字
        this.name = opts.name;
        // 设置 tensorId
        this.tensorId = opts.type;
        // tensor的形状
        let shape = this.shape = opts.shape;
        // 原始数据个数
        this.total = shape.reduce((all: number, num: number) => all * num);
        // 图像tensor是否带有batch
        if (opts.needBatch && shape.length < 4) {
            const batch: number[] = [];
            for (let i = 0; i < (4 - shape.length); i++) {
                batch.push(1);
            }
            shape = batch.concat(shape);
            this.shape = shape;
        }
        // 获取转换到texture后的信息
        const {
            exceedMax,
            shape: shape_texture,
            packedShape = [],
            packedTextureShape = []
        } = Utils.getTextureInfoFromTensorShape(shape, opts.isPacked);
        this.shape_texture = shape_texture;
        this.shape_texture_packed = packedTextureShape;
        this.shape_packed = packedShape;
        this.exceedMax = exceedMax;
        // tensor数据
        if (opts.type === 'image' || opts.type === 'x') {
            // this.data = opts.data;
            this.data = Utils.padOpData(
                opts.data,
                [shape[0], shape[1] * (this.isPacked ? 4 : 1), shape[2], shape[3]],
                this.isPacked
            );
        }
        else if (opts.data && opts.data.length) {
            const packedData = opts.data;
            if (!opts.notCompressed) {
                let nhwcData: Float32Array | number[] = Utils.nchw2nhwc(
                    opts.data,
                    [shape[0], shape[1] * (this.isPacked ? 4 : 1), shape[2], shape[3]]
                );
                this.data = new Float32Array(nhwcData);
                if (this.shape_texture_packed.length > 0) {
                    // this.packedData = new Float32Array(Utils.nchw2nhwc(packedData, [shape[0], this.shape_packed[1] * 4, shape[2], shape[3]]));
                    // let packedData = opts.data;
                    const nhwcPackedData = Utils.nchw2nhwc(
                        packedData,
                        [shape[0], this.shape_packed[1] * 4, shape[2], shape[3]]
                    );
                    this.packedData = new Float32Array(nhwcPackedData);
                }
                else {
                    // let nhwcData = Utils.nchw2nhwc(opts.data, [shape[0], shape[1] * (this.isPacked ? 4 : 1),shape[2], shape[3]]);
                    nhwcData = Utils.padOpData(
                        nhwcData,
                        [shape[0], shape[1] * (this.isPacked ? 4 : 1), shape[2], shape[3]],
                        this.isPacked
                    );
                    this.data = new Float32Array(nhwcData);
                    this.packedData = this.data;
                }
            }
            else {
                // batchnorm的scale
                this.shape_texture = [4, 1, this.total / 4];
                // data = [].concat(opts.data);
                this.data = new Float32Array(opts.data);
            }

            // this.data = new Float32Array(data);
            // console.log('this.data.length', this.data.length);
            // 清理缓存
            opts.data = null;
        }
    }

    get width_texture() {
        const length = this.shape_texture.length;
        return this.shape_texture[length - 1];
    }

    get height_texture() {
        const length = this.shape_texture.length;
        return this.shape_texture[length - 2];
    }

    get width_shape() {
        const length = this.shape.length;
        return this.shape[length - 1];
    }

    get height_shape() {
        const length = this.shape.length;
        return this.shape[length - 2];
    }

    get channel() {
        const length = this.shape.length;
        if (length >= 3) {
            return this.shape[length - 3];
        }
        return 0;
    }

    get binding() {
        return this.opts.binding;
    }

    get limit() {
        return this.exceedMax ? 'Limit' : '';
    }

    get length_shape() {
        return this.shape.length || 0;
    }

    /**
     * 获取shape对应的个数
     * @return {Array} 和shape长度相等的对应个数
     */
    get numbers_shape() {
        const numbers: any = [];
        const sLen = this.shape.length;
        for (let i = 0; i < (sLen - 1); i++) {
            const number = this.shape.slice(i + 1).reduce((total, num) => total * num);
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
