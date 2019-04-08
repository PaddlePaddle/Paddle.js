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
        this.minPixs = 225;
    };

    /**
     * 处理图像方法
     * @param inputs
     */
    process(inputs) {
        const path = inputs.path;
        const mode = inputs.mode;
        const channel = inputs.channel;
        const rotate = inputs.rotate;
        this.fromPixels(path);
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
        if (data && params.width && params.height) {
            this.fromPixels2DContext.canvas.width = pixels.width;
            this.fromPixels2DContext.canvas.height = pixels.height;
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
            .getImageData(0, 0, pixels.width, pixels.height)
            .data;
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

    fromPixels(image, opt) {

        return [{data: values, shape: shape, name: 'pixel'}];
    }
}
/* eslint-enable */
