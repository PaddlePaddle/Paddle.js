/**
 * @file 工具类
 * @author yangmingming
 */
let canvas = null;
export default {
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

    // 更新数据
    splitData(pixelData, size) {
        const total = size.w * size.h;
        const rData = [];
        const gData = [];
        const bData = [];
        for (let i = 0; i < total; i++) {
            rData.push(pixelData[i * 4 + 0]);
            gData.push(pixelData[i * 4 + 1]);
            bData.push(pixelData[i * 4 + 2]);
        }
        return rData.concat(gData).concat(bData);
    }
};

