
/**
 * @file Tensor类
 */

import * as Utils from './utils';

interface TensorParams {
    type: string;
    name: string;
    shape: number[];
    data: Float32Array | number[] | null;
    isPacked?: boolean;
    binding?: number
}

export default class Tensor {
    opts: TensorParams = {} as TensorParams;
    isPacked: boolean = false;
    name: string = '';
    tensorId: string = '';
    total: number = 1;
    shape: number[] = [];
    shape_texture: number[] = [];
    exceedMax: boolean = false;
    data: Float32Array | number[] | null = null;

    constructor(opts: TensorParams) {
        this.opts = opts;
        // 数据存储方式
        this.isPacked = opts.isPacked || false;
        // 设置tensor名字
        this.name = opts.name;
        // 设置 tensorId
        this.tensorId = opts.type;
        // tensor的形状
        this.shape = Utils.formatShape(opts.shape);
        const shape = this.shape;
        // 原始数据个数
        this.total = shape.reduce((all: number, num: number) => all * num);
        // 获取转换到texture后的信息
        const {
            exceedMax,
            shape: shape_texture
        } = Utils.getTextureInfoFromTensorShape(shape, opts.isPacked);
        this.shape_texture = shape_texture;
        this.exceedMax = exceedMax;
        // tensor数据
        if (opts.type === 'image') {
            this.data = opts.data;
        }
        else if (opts.data && opts.data.length) {
            const nhwcData: Float32Array | number[] = Utils.nchw2nhwc(
                opts.data,
                [shape[0], shape[1] * (this.isPacked ? 4 : 1), shape[2], shape[3]]
            );
            this.data = new Float32Array(nhwcData);
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

    get total_shape() {
        return this.total;
    }
}

