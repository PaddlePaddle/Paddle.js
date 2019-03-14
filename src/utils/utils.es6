/**
 * @file 工具类
 * @author yangmingming
 */
/* eslint-disable */
let canvas = null;
const CONV2D_VARIABLE = [
    'DIM_SIZE_WIDTH',
    'DIM_SIZE_HEIGHT',
    'FILTER_SIZE_WIDTH',
    'FILTER_SIZE_HEIGHT',
    'ORIGIN_SIZE_WIDTH',
    'ORIGIN_SIZE_HEIGHT',
    'OUT_SIZE_WIDTH',
    'OUT_SIZE_HEIGHT',
    'STRIDE_HORIZONTAL',
    'STRIDE_VERTICAL',
    'PAD_LEFT',
    'PAD_TOP',
    'DILATION_HORIZONTAL',
    'DILATION_VERTICAL',
    'FILTER_SHAPE_LENGTH',
    'TENSOR_LENGTH',
    'SHAPE_LENGTH',
    'SHAPE_NUMBERS',
    'FILTER_TEXTURE_WIDTH',
    'FILTER_TEXTURE_HEIGHT'
];
// op的输入参数配置
const conf = {
    conv2d: CONV2D_VARIABLE
};
export default {
    // todo: 适用2维矩阵乘法，以后实现通用版本
    getReshapeInPaddle(inputShape = [], counterShape = [], outShape = []) {
        let total = inputShape.reduce((all, num) => all * num);
        if (outShape.length === 1) {
            return [1, total];
        } else {
            return [outShape[0], total / outShape[0]];
        }
    },

    getBroadcastShapeInPaddle(shapeA= [], shapeB = [], axis = 1) {
        // todo: 简易版本，以后需要实现一个通用版本
        let bigger = shapeA;
        let result = shapeB;
        if (shapeA.length - shapeB.length < 0) {
            bigger = shapeB;
            result = shapeA;
        }
        return result.concat(bigger.slice(axis));
    },

    getBroadcastDims(inShape = [], outShape = []) {
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
    },

    getBroadcastShape(shapeA = [], shapeB = []) {
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
    },
    // 注入op数据
    populateData(type, fscode = '', data = {}) {
        let result = fscode;
        const params = conf[type] || [];
        params.forEach(key => {
            let value = data[key.toLowerCase()];
            // 默认值为1
            result = result.replace(new RegExp(key, 'g'), typeof value === 'undefined' ? 1 : value);
        });
        return result;
    },

    // 生成随机数
    randomFloat() {
        return parseFloat(Math.random() * 10);
    },

    // mock test
    mock(shapeA, shapeB) {
        // 生成shape为[3]的数据
        let number = shapeB[0];
        const f3Data = new Float32Array(number);
        for (let i = 0; i < number; i++) {
            f3Data[i] = this.randomFloat();
        }
        let bufferDataB = new Float32Array(this.buildShapeBData(shapeA, shapeB, f3Data));
        return bufferDataB;
    },

    getIndexFromShapeA(shapeA, shapeB) {
        let axis = -1;
        let i = shapeA.length - 1;
        let j = shapeB.length - 1;
        while (i > -1 && j > -1) {
            if (shapeB[j] === shapeA[i]) {
                j--;
            }
            i--;
        }
        if (j === -1) {
            axis = i + 1;
        }
        return axis;
    },

    /**
     *
     * @param shapeA
     * @param {object} shapeB 只有一个元素
     * @param bufferDataB
     * @return {Array}
     */
    buildShapeBData(shapeA, shapeB, bufferDataB) {
        let length = shapeA.length;
        let axis = length - this.getIndexFromShapeA(shapeA, shapeB) - 1;
        let reverse = shapeA.reverse();
        let result = [];
        let total = reverse[0];
        for (let i = 1; i < axis; i++) {
            total = total * reverse[i];
        }
        for (let i = 0; i <= axis; i++) {
            result = result.concat(this.buildSameArray(total, bufferDataB[i]));
        }
        // 添加alpha channel
        result = result.concat(this.buildSameArray(total, 0));
        return result;
    },

    /**
     * 生成tensor数据, M * H * W * D, H * 4 * 4
     * @params {Array} shape 形状
     * @params
     */
    buildTensor(shape = [], data) {
        let batch = shape[0];
        let height = shape[2];
        let width = shape[3];
        let channel = shape[1];
        let total = shape.reduce((all, num) => all * num);
        let cube = total / batch;
        let old = data.toString().split(',');
        let newOne = [];
        let tw = 2;
        let th = 2;
        // old的length是W*H
        if (old.length < total) {
            // 广播数组
            for (let i = 0; i < batch * channel; i++) {
                newOne = newOne.concat(old);
            }
            /*for (let i = 0; i < batch; i++) {
                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width; w++) {
                        for (let j = 0; j < channel; j++) {
                            newOne.push(+old[h * width + w]);
                        }
                    }
                }
            }*/
        }
        // todo: 需要计算生成对应材质
        return {
            data: new Float32Array(newOne),
            d: 4,
            w: total / (1 * 4 * height),
            h: height
        };
    },

    /**
     * 获取texture形状和补0个数
     * @param shape {Array} tensor的形状
     * @return {{shape: *[], zeroNumber: number}} {Object} texture信息
     */
    getTextureInfoFromTensorShape(shape = []) {
        let total = shape.reduce((total, num) => total * num);
        // 需要补0的个数
        let zeroNumber = (total % 4 === 0) ? 0 : (4 - (total % 4));
        // 对齐材质channel 4
        // 材质宽高
        let width = 1;
        let height = (total + zeroNumber) / 4;
        while (Math.abs(width - height) > 2 && width < height) {
            if (height % 2 === 0) {
                width = width * 2;
                height = height / 2;
            } else {
                height += 1;
            }
        }
        return {
            shape: [4, height, width],
            zeroNumber: 4 * height * width - total
        };
    },

    /**
     * 生成相同value的数组
     * @param length
     */
    buildSameArray(length, value) {
        let result = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    },

    // 压缩
    async loadShader(name) {
        let shader = await fetch(this.getShaderFile(name));
        return shader.text();
    },

    getShaderFile(url) {
        // todo: 根据脚手架获取shader文件
        const aa = url.split('/');
        let length = aa.length;
        return '/' + aa[length - 1];
    },

    // 获取一个数的幂，用来设定图片的大小
    getPower(num = 2) {
        return Math.ceil(Math.log2(num));
    },

    // 探测形状
    infoShape(shape = [], factor = []) {
        let needInfo = false;
        let numbers = shape.reduce((total, item) => {
            if (item > 0) {
                total *= item;
            } else {
                needInfo = true;
            }
            return total;
        }, 1);
        if (!needInfo) {
            return shape;
        }
        let dim = Math.floor(factor.length / numbers);
        return shape.map(item => item > 0 ? item : dim);
    },

    // 图片压缩
    imgCompress(img, size) {
        if (!canvas) {
            canvas = document.createElement('canvas');
        }
        if (size) {
            canvas.width = size.w;
            canvas.height = size.h;
        }
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, size.w, size.h);
    },

    /**
     * [r, g, b, a] to [{r, g, b, a}], tensor(图像类型)转变成图像材质texture
     * @param tensor {Array} tensor数据
     * @param size {Number} 每个channel的元素个数
     * @return texture {Array} 图像材质数据
     */
    tensor2Texture(tensor, size) {
        return tensor;
        const texture = [];
        const len = tensor.length;
        const channel = len / size;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < channel; j++) {
                texture.push(tensor[i + j * size]);
            }
        }
        return texture;
    },

    // shape
    shapeData(pixelData, shape) {

        const total = shape.w * shape.h;
        const rData = [];
        const gData = [];
        const bData = [];
        const aData = [];
        for (let i = 0; i < total; i++) {
            rData.push(pixelData[i * 4 + 0]);
            gData.push(pixelData[i * 4 + 1]);
            bData.push(pixelData[i * 4 + 2]);
            aData.push(pixelData[i * 4 + 3]);
        }
        return rData.concat(gData).concat(bData).concat(aData);
    }
};
/* eslint-enable */
