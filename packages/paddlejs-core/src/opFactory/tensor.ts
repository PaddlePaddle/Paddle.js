
/**
 * @file Tensor类
 */

import * as Utils from './utils';

interface TensorParams {
    type: string;
    name: string;
    shape: number[];
    data: Float32Array | number[] | null;
    persistable: boolean;
    interpType?: string;
    isPacked?: boolean;
    binding?: number;
    noLayout?: boolean;
}

export default class Tensor {
    opts: TensorParams = {} as TensorParams;
    isPacked: boolean = false;
    name: string = '';
    tensorId: string = '';
    total: number = 1;
    shape: number[] = [];
    unformattedShapeLength: number = 0;
    shape_texture: number[] = [];
    exceedMax: boolean = false;
    data: Float32Array | number[] | null = null;
    persistable: boolean = false;
    interpType: string = 'NEAREST';

    constructor(opts: TensorParams) {
        this.opts = opts;
        // 数据存储方式
        this.isPacked = opts.isPacked || false;
        // 设置tensor名字
        this.name = opts.name;
        this.persistable = opts.persistable || false;
        this.interpType = opts.interpType || 'NEAREST';
        // 设置 tensorId
        this.tensorId = opts.type;
        // 保留 model 原生 shape 长度
        this.unformattedShapeLength = opts.shape.length;
        // tensor的形状
        this.shape = Utils.formatShape(opts.shape);
        const shape = this.shape;
        // 原始数据个数
        this.total = shape.reduce((all: number, num: number) => all * num);

        if (opts.noLayout) {
            return;
        }
        // 获取转换到texture后的信息
        const {
            exceedMax,
            shape: shape_texture
        } = Utils.getTextureInfoFromTensorShape(shape, opts.isPacked);
        this.shape_texture = shape_texture;
        this.exceedMax = exceedMax;
        // tensor数据
        if (opts.data && opts.data.length) {
            this.data = new Float32Array(opts.data);
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
        return this.shape[length - 3];
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

    get length_unformatted_shape() {
        return this.unformattedShapeLength || 0;
    }

    get total_shape() {
        return this.total;
    }

    get numbers_shape() {
        const numbers = [];
        const sLen = this.shape.length;
        for (let i = 0; i < (sLen - 1); i++) {
            const number = this.shape.slice(i + 1).reduce((total, num) => total * num);
            numbers.push(number);
        }
        // 和shape长度保持一致
        numbers.push(1);
        return numbers;
    }
}

