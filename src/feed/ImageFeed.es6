/* eslint-disable */
/**
 * @file image，feed 获取图像相关输入
 * @author wangqun@baidu.com
 */
export default class imageFeed {
    constructor() {
        this.fromPixels2DContext = document.createElement('canvas').getContext('2d');
        this.defaultWidth = 224;
        this.defaultHeight = 224;
        this.minPixels = 225;
        this.pixels = '';
    };

    /**
     * 处理图像方法
     * @param inputs
     */
    process(inputs) {
        const input = inputs.input;
        const mode = inputs.mode;
        const channel = inputs.channel;
        const rotate = inputs.rotate;
        const params = inputs.params;
        let output = [];

        output = this.fromPixels(input, params);
        return output;
    };

    /**
     * crop图像&重新设定图片tensor形状
     * @param shape
     */
    reshape(imageData, opt, scaleSize) {
        const {sw, sh} = scaleSize;
        const {width, height} = opt;
        const hPadding = Math.ceil((sw - width) / 2);
        const vPadding = Math.ceil((sh - height) / 2);

        let data = imageData.data;
        let red = [];
        let green = [];
        let blue = [];
        let mean = opt.mean;
        let std = opt.std;
        for (let i = 0; i < data.length; i += 4) {
            // img_mean 0.485, 0.456, 0.406
            //img_std 0.229, 0.224, 0.225
            let index = i / 4;
            let vIndex = Math.floor(index / sw);
            let hIndex = index - (vIndex * sw) - 1;
            if (hIndex >= hPadding && hIndex < (hPadding + width) &&
                vIndex >= vPadding && vIndex < (vPadding + height)) {
                red.push(((data[i] / 255) - mean[0]) / std[0]); // red
                green.push(((data[i + 1] / 255) - mean[1]) / std[1]); // green
                blue.push(((data[i + 2] / 255) - mean[2]) / std[2]); // blue
            }
        }
        let tmp = green.concat(blue);
        return red.concat(tmp);
    };

    /**
     * 根据scale缩放图像
     * @param image
     * @param params
     * @return {Object} 缩放后的尺寸
     */
    reSize(image, params) {
        // 原始图片宽高
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        // 缩放后的宽高
        let sw = width;
        let sh = height;
        // 最小边缩放到scale
        if (width < height) {
            sw = params.scale;
            sh = Math.round(sw * height / width);
        } else {
            sh = params.scale;
            sw = Math.round(sh * width / height);
        }
        this.fromPixels2DContext.canvas.width = sw;
        this.fromPixels2DContext.canvas.height = sh;
        this.fromPixels2DContext.drawImage(
            image, 0, 0, sw, sh);
        return {sw, sh};
    };

    /**
     * 获取图像内容
     * @param pixels
     * @returns {Uint8ClampedArray}
     */
    getImageData(pixels, scaleSize) {
        const {sw, sh} = scaleSize;
        let vals = this.fromPixels2DContext
            .getImageData(0, 0, sw, sh);
        // crop图像
        const width = pixels.width;
        const height = pixels.height;
        return vals;
    };

    /**
     * 计算灰度图
     * @param imageData
     * @returns {*}
     */
    grayscale (imageData) {
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        return data;
    };

    /**
     * 图像转换成像素
     * @param pixels
     * @param opt
     * @returns {{data: *, shape: *, name: string}[]}
     */
    fromPixels(pixels, opt) {
        let data;
        let scaleSize;
        if (pixels instanceof HTMLImageElement || pixels instanceof HTMLVideoElement) {
            scaleSize = this.reSize(pixels, opt);
            data = this.getImageData(opt, scaleSize);
        }

        if (opt.gray) {
            data = grayscale (data);
        }

        if (opt.shape) {
            data = this.reshape(data, opt, scaleSize);
        }
        return [{data: data, shape: opt.shape, name: 'image'}];
    }
}
/* eslint-enable */
