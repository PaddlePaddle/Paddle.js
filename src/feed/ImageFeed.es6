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
        let output = [];

        output = this.fromPixels(input);
        return output;
    };

    /**
     * 重新设定图片tensor形状
     * @param shape
     */
    reshape(shape) {

    };

    /**
     * 重新设定图像大小
     * @param data
     * @param params
     */
    reSize(data, params) {
        params.width = params.width || this.defaultWidth;
        params.height = params.height || this.defaultHeight;
        if (data && params.width && params.height) {
            this.fromPixels2DContext.canvas.width = params.width || this.defaultWidth;
            this.fromPixels2DContext.canvas.height = params.height || this.defaultHeight;
            this.fromPixels2DContext.drawImage(
                data, 0, 0, params.width, params.height);
        }
    };

    /**
     * 获取图像内容
     * @param pixels
     * @returns {Uint8ClampedArray}
     */
    getImageData(pixels) {
        let vals = this.fromPixels2DContext
            .getImageData(0, 0, pixels.width, pixels.height);
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

    fromPixels(pixels, opt) {
        let data;
        if (pixels instanceof HTMLImageElement || pixels instanceof HTMLVideoElement) {
            this.reSize(pixels, params);
            data = this.getImageData(pixels);
        }

        if (opt.gray) {
            data = grayscale (data);
        }

        if (opt.shape) {

        }
        return [{data: values, shape: shape, name: 'pixel'}];
    }
}
/* eslint-enable */
