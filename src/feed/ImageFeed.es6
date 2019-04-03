/* eslint-disable */
/**
 * @file image，feed 获取图像相关输入
 * @author wangqun@baidu.com
 */
export default class imageFeed {
    constructor() {
        this.fromPixels2DContext = document.createElement('canvas').getContext('2d');
    };

    process(inputs) {
        const path = inputs.path;
        const mode = inputs.mode;
        const channel = inputs.channel;
        const rotate = inputs.rotate;
        this.fromPixels(path);
    };

    reshape(shape) {

    };

    fromPixels(image, opt) {

        return [{data: values, shape: shape, name: 'pixel'}];
    }
}
/* eslint-enable */
