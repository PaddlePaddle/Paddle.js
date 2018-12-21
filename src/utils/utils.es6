/**
 * @file 工具类
 * @author yangmingming
 */
let canvas = null;
export default {
    // 生成随机数
    randomFloat() {
        return parseFloat(Math.random() * 10);
    },

    // 生成zero数组
    zeros(num) {
        if (typeof num === 'undefined' || isNaN(num)) {
            return [];
        }
        if (typeof  ArrayBuffer === 'undefined') {
            return this.buildSameArray(num, 0);
        } else {
            return new Float32Array(num);
        }
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
        let shader = await fetch(name);
        return shader.text();
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

    // shape数据,rgb3个channel
    shapeData(pixelData, size) {
        const total = size.w * size.h;
        const rData = [];
        const gData = [];
        const bData = [];
        const aData = [];
        for (let i = 0; i < total; i++) {
            rData.push(pixelData[i * 4 + 0]);
            gData.push(pixelData[i * 4 + 1]);
            bData.push(pixelData[i * 4 + 2]);
            aData.push(0);
        }
        return rData.concat(gData).concat(bData).concat(aData);
    }
};

