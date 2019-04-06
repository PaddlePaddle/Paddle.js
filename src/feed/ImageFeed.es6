/* eslint-disable */
/**
 * @file image，feed 获取图像相关输入
 * @author wangqun@baidu.com
 */
export default class imageFeed {
    constructor() {
        this.fromPixels2DContext = document.createElement('canvas').getContext('2d');
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

    fromPixels(image, opt) {

        return [{data: values, shape: shape, name: 'pixel'}];
    }
}
/* eslint-enable */
