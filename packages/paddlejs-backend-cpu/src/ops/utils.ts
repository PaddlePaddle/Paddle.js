/**
 * @file op 相关辅助函数
 * @author yueshuangyan
 */

import { Tensor } from '../types';

interface opInfo {
    [key: string]: any
}

const inputParams = [
    'length_shape',
    'width_shape',
    'height_shape',
    'width_texture',
    'height_texture',
    'offset_x',
    'offset_y',
    'limit',
    'channel',
    'total_shape'
];

const outParams = [
    'total_shape',
    'width_shape',
    'height_shape',
    'width_texture',
    'height_texture',
    'channel'
];

const baseParams = {
    float: [
        'multi_value',
        'bias_value'
    ],
    bool: [
        'fuse_relu'
    ]
};

function getTensorParams(inputTensors: Tensor[], ownParams: [], fShaderParams: object): opInfo {
    const tensorsParams = {};
    const opParams = {};
    const tensorNames = [] as string[];

    // inputParams
    for (const tensor of inputTensors) {
        const name = tensor.name;
        // 提取inputParams
        const inputVars = {};
        for (const param of inputParams) {
            if (typeof (tensor[param]) !== 'undefined') {
                inputVars[param] = tensor[param];
            }
        }

        tensorsParams[name] = inputVars;
        tensorNames.push(name);
    }


    // ownParams
    if (ownParams) {
        for (const param of ownParams) {
            if (typeof (fShaderParams[param]) !== 'undefined') {
                opParams[param] = fShaderParams[param];
            }
        }
    }

    // baseParams
    for (const type of Object.keys(baseParams)) {
        const params = baseParams[type];
        for (const param of params) {
            if (typeof (fShaderParams[param]) !== 'undefined') {
                opParams[param] = `${type}(${fShaderParams[param]})`;
            }
        }
    }

    // outputParams
    const outputVars = {};
    for (const param of outParams) {
        if (typeof (fShaderParams[param + '_out']) !== 'undefined') {
            outputVars[param] = fShaderParams[param + '_out'];
        }
    }
    tensorsParams['out'] = outputVars;

    // 将active_function放在opParams中
    if (fShaderParams['active_function']) {
        opParams['active_function'] = fShaderParams['active_function'];
    }
    return { textureParams: tensorsParams, opParams, active_function: fShaderParams['active_function'] };
}


function getExactOpName(name, params) {
    if (name.indexOf('conv2d-elementwise_add') > -1) {
        return 'conv2d_elementwise_add';
    }
    else if (name === 'concat' && params['binding_appender']) {
        return 'concat_mul';
    }

    return name;
}

function computeStrides(shape) {
    const rank = shape.length;
    if (rank < 2) {
        return [];
    }

    // Last dimension has implicit stride of 1, thus having D-1 (instead of D)
    // strides.
    const strides = new Array(rank - 1);
    strides[rank - 2] = shape[rank - 1];
    for (let i = rank - 3; i >= 0; --i) {
        strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
}

function sizeFromShape(shape: number[]): number {
    if (shape.length === 0) {
        // Scalar.
        return 1;
    }
    let size = shape[0];
    for (let i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}

class TensorBuffer {
    size: number;
    shape: number[];
    strides: number[];
    values: Float32Array;

    constructor(shape) {
        this.shape = shape.slice();
        this.size = sizeFromShape(shape);
        this.values = new Float32Array(this.size).fill(0.0);
        this.strides = computeStrides(shape);
    }

    /**
     * Sets a value in the buffer at a given location.
     *
     * @param value The value to set.
     * @param locs  The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    set(value, ...locList: number[]): void {
        let locs = Array.from(locList);
        if (locs.length === 0) {
            locs = [0];
        }
        const index = this.locToIndex(locs);
        this.values[index] = value as number;
    }

    /**
     * Returns the value in the buffer at the provided location.
     *
     * @param locs The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    get(...locList: number[]) {
        let locs = Array.from(locList);
        if (locs.length === 0) {
            locs = [0];
        }
        let i = 0;
        for (const loc of locs) {
            if (loc < 0 || loc >= this.shape[i]) {
                const msg = `Requested out of range element at ${locs}.
                        Buffer shape=${this.shape}`;
                throw new Error(msg);
            }
            i++;
        }
        let index = locs[locs.length - 1];
        for (let i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return this.values[index];
    }

    locToIndex(locs: number[]): number {
        if (this.rank === 0) {
            return 0;
        }
        else if (this.rank === 1) {
            return locs[0];
        }
        let index = locs[locs.length - 1];
        for (let i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return index;
    }

    indexToLoc(cur: number): number[] {
        let index = cur;
        if (this.rank === 0) {
            return [];
        }
        else if (this.rank === 1) {
            return [index];
        }
        const locs: number[] = new Array(this.shape.length);
        for (let i = 0; i < locs.length - 1; ++i) {
            locs[i] = Math.floor(index / this.strides[i]);
            index -= locs[i] * this.strides[i];
        }
        locs[locs.length - 1] = index;
        return locs;
    }

    get rank() {
        return this.shape.length;
    }

    /**
     * Creates an immutable `tf.Tensor` object from the buffer.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
}

export {
    getExactOpName,
    getTensorParams,
    computeStrides,
    TensorBuffer
};
