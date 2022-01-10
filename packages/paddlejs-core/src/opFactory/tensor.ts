
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
    dataLayout?: string;
    runtime?: number;
}

export default class Tensor {
    isPacked: boolean = false;
    name: string = '';
    tensorId: string = '';
    total: number = 1;
    shape: number[] = [];
    unformattedShapeLength: number = 0;
    shape_texture: number[] = [];
    exceedMax: boolean = false;
    data: Float32Array | number[] | Uint8Array | null = null;
    persistable: boolean = false;
    interpType: string = 'NEAREST';
    dataLayout: string = '';
    runtime: number = 0;
    binding: number = 0;

    constructor(opts: TensorParams) {
        const {
            isPacked = false,
            name,
            runtime = 0,
            persistable = false,
            type,
            dataLayout,
            interpType = 'NEAREST',
            shape,
            data: varData,
            binding = 0
        } = opts;
        // 数据存储方式
        this.isPacked = isPacked;
        // 设置tensor名字
        this.name = name;
        this.runtime = runtime;
        this.binding = binding;
        this.persistable = persistable;
        this.interpType = interpType;
        // 设置 tensorId
        this.tensorId = type;
        // set dataLayout
        this.dataLayout = dataLayout;
        // 保留 model 原生 shape 长度
        this.unformattedShapeLength = shape.length;
        // tensor的形状
        this.shape = Utils.formatShape(shape);
        // 原始数据个数
        this.total = this.shape.reduce((all: number, num: number) => all * num);

        if (opts.noLayout) {
            return;
        }

        // tensor数据
        if (varData && varData.length) {
            this.data = Utils.genTensorData(varData, this.dataLayout, shape, this.isPacked);
            opts.data = null;
        }
    }

    get width_texture() {
        const length = this.shape_texture.length;
        return this.shape_texture[length - 1] || 1;
    }

    get height_texture() {
        const length = this.shape_texture.length;
        return this.shape_texture[length - 2] || 1;
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

