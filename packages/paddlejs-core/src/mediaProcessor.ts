/**
 * @file 处理图像相关输入
 */

import { InputFeed } from './commons/interface';

type Color = string;

export default class MediaProcessor {
    targetContext: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
    gapFillWith: Color = '#000';
    mean: number[] = [0, 0, 0];
    std: number[] = [1, 1, 1];
    bgr: boolean = false;
    result: Float32Array | number[] = [];
    pixelWidth: number = 224;
    pixelHeight: number = 224;
    inputFeed: InputFeed[] = [];

    constructor() {
        const targetCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.targetContext = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
    };

    /**
     * 处理图像方法
     * @param inputs
     */
    process(media, modelConfig): InputFeed[] {
        const { feedShape, fill, targetSize, scale, mean, std, bgr } = modelConfig;
        const { fh, fw } = feedShape;
        const input = media;

        const params = {
            gapFillWith: fill || this.gapFillWith,
            mean: mean || this.mean,
            std: std || this.std,
            bgr: bgr || this.bgr,
            scale,
            targetSize,
            targetShape: [1, 3, fh, fw]
        };

        if (this.result.length === 0) {
            const [, c, h, w] = params.targetShape;
            // 计算确定targetShape所需Float32Array占用空间
            this.result = new Float32Array(h * w * c);
        }
        return this.fromPixels(input, params) || [];
    }

    fromPixels(pixels, opt): InputFeed[] {
        let data: ImageData | number[] = [];
        let scaleSize;

        if (!(pixels instanceof HTMLImageElement || pixels instanceof HTMLVideoElement)) {
            return [{
                data: data,
                shape: opt.shape || opt.targetShape,
                name: 'image'
            }] as InputFeed[];
        }

        this.pixelWidth = pixels.width;
        this.pixelHeight = pixels.height;

        if (opt.scale && opt.targetSize) { // Moblienet的情况
            data = this.resizeAndFitTargetSize(pixels, opt);
        }
        else if (opt.targetSize) { // 如果有targetSize，就是装在目标宽高里的模式 TinyYolo的情况
            scaleSize = this.fitToTargetSize(pixels, opt);
            data = this.getImageData(0, 0, scaleSize);
        }
        else {
            scaleSize = this.reSize(pixels, opt);
            data = this.getImageData(0, 0, scaleSize);
        }

        if (opt.gray) {
            data = this.grayscale(data);
        }

        if (opt.reShape) {
            data = this.reshape(data, opt, scaleSize);
        }

        if (opt.bgr) {
            data = this.allReshapeToBGR(data, opt) as number[];
        }
        else if (opt.targetShape) {
            data = this.allReshapeToRGB(data, opt) as number[];
        }

        return [{
            data: data,
            shape: opt.targetShape || opt.shape,
            name: 'image'
        }] as InputFeed[];
    }

    /**
     * crop图像&重新设定图片tensor形状
     * @param shape
     */
    reshape(imageData, opt, scaleSize) {
        const { sw, sh } = scaleSize;
        const { width, height } = opt;
        const hPadding = Math.ceil((sw - width) / 2);
        const vPadding = Math.ceil((sh - height) / 2);

        const data = imageData.data;
        // channel RGB
        const red: number[] = [];
        const green: number[] = [];
        const blue: number[] = [];
        // 平均数
        const mean = opt.mean;
        // 标准差
        const std = opt.std;
        // 考虑channel因素获取数据
        for (let i = 0; i < data.length; i += 4) {
            // img_mean 0.485, 0.456, 0.406
            // img_std 0.229, 0.224, 0.225
            const index = i / 4;
            const vIndex = Math.floor(index / sw);
            const hIndex = index - (vIndex * sw) - 1;
            if (hIndex >= hPadding && hIndex < (hPadding + width)
                && vIndex >= vPadding && vIndex < (vPadding + height)) {
                red.push(((data[i] / 255) - mean[0]) / std[0]); // red
                green.push(((data[i + 1] / 255) - mean[1]) / std[1]); // green
                blue.push(((data[i + 2] / 255) - mean[2]) / std[2]); // blue
            }
        }
        // 转成 GPU 加速 NCHW 格式
        return red.concat(green.concat(blue));
    }

    /**
     * 全部转rgb * H * W
     * @param imageData 数据
     * @param opt 参数
     * @param opt.mean 均值
     * @param opt.std 方差
     * @param opt.targetShape 输出shape
     * @param opt.normalizeType 0：将数据映射为0~1， 1：映射为-1~1之间
     */
    allReshapeToRGB(imageData, opt) {

        // mean和std是介于0-1之间的
        const { mean, std, normalizeType = 0, targetShape } = opt;
        const [, c, h, w] = targetShape;
        const data = imageData.data || imageData;

        const result = this.result;
        let offset = 0;

        // h w c
        for (let i = 0; i < h; ++i) {
            const iw = i * w;
            for (let j = 0; j < w; ++j) {
                const iwj = iw + j;
                for (let k = 0; k < c; ++k) {
                    const a = iwj * 4 + k;
                    result[offset] = normalizeType === 0 ? data[a] / 255 : (data[a] - 128) / 128;
                    result[offset] -= mean[k];
                    result[offset] /= std[k];
                    offset++;
                }
            }
        }

        return result;
    }

    /**
     * 全部转bgr * H * W
     * @param shape
     */
    allReshapeToBGR(imageData, opt) {
        const [, c, h, w] = opt.targetShape;
        const data = imageData.data || imageData;
        // mean和std是介于0-1之间的
        const mean = opt.mean;
        const std = opt.std;
        const result = this.result;
        let offset = 0;
        // h w c
        for (let i = 0; i < h; ++i) {
            const iw = i * w;
            for (let j = 0; j < w; ++j) {
                const iwj = iw + j;
                for (let k = 0; k < c; ++k) {
                    const a = iwj * 4 + (2 - k);
                    result[offset] = data[a];
                    result[offset] -= mean[2 - k];
                    result[offset] /= std[2 - k];
                    // result[offset] = 0.5;
                    offset++;
                }
            }
        }
        return result;
    }


    /**
     * 根据scale缩放图像
     * @param image
     * @param params
     * @return {Object} 缩放后的尺寸
     */
    reSize(image, params) {
        // 原始图片宽高
        const width = this.pixelWidth;
        const height = this.pixelHeight;
        // 缩放后的宽高
        let sw = width;
        let sh = height;
        sw = sh = params.scale;

        this.targetContext.canvas.width = sw;
        this.targetContext.canvas.height = sh;
        this.targetContext.drawImage(
            image, 0, 0, sw, sh);
        return { sw, sh };
    }

    /**
     * 根据scale缩放图像并且缩放成目标尺寸并居中
     */
    resizeAndFitTargetSize(image, params) {
        // 原始图片宽高
        const width = this.pixelWidth;
        const height = this.pixelHeight;
        // 缩放后的宽高
        let sw = width;
        let sh = height;
        // 最小边缩放到scale
        if (width < height) {
            sw = params.scale;
            sh = Math.round(sw * height / width);
        }
        else {
            sh = params.scale;
            sw = Math.round(sh * width / height);
        }

        this.targetContext.canvas.width = sw;
        this.targetContext.canvas.height = sh;
        const targetWidth = params.targetSize.width;
        const targetHeight = params.targetSize.height;
        this.targetContext.drawImage(image, 0, 0, sw, sh);
        const x = (sw - targetWidth) / 2;
        const y = (sh - targetHeight) / 2;
        sw = targetWidth;
        sh = targetHeight;
        const data = this.getImageData(x, y, { sw, sh });
        return data;
    }

    /**
     * 缩放成目标尺寸并居中
     */
    fitToTargetSize(image, params, center?) {
        // 目标尺寸
        const targetWidth = params.targetSize.width;
        const targetHeight = params.targetSize.height;
        this.targetContext.canvas.width = targetWidth;
        this.targetContext.canvas.height = targetHeight;
        this.targetContext.fillStyle = params.gapFillWith;
        this.targetContext.fillRect(0, 0, targetHeight, targetWidth);
        // 缩放后的宽高
        let sw = targetWidth;
        let sh = targetHeight;
        let x = 0;
        let y = 0;
        // target的长宽比大些 就把原图的高变成target那么高
        if (targetWidth / targetHeight * this.pixelHeight / this.pixelWidth >= 1) {
            sw = Math.round(sh * this.pixelWidth / this.pixelHeight);
            x = Math.floor((targetWidth - sw) / 2);
        }
        // target的长宽比小些 就把原图的宽变成target那么宽
        else {
            sh = Math.round(sw * this.pixelHeight / this.pixelWidth);
            y = Math.floor((targetHeight - sh) / 2);
        }
        if (center) {
            this.targetContext.drawImage(image, x, y, sw, sh);
        }
        else {
            this.targetContext.drawImage(image, 0, 0, sw, sh);
        }
        return { sw: targetWidth, sh: targetHeight };
    }

    /**
     * 获取图像内容
     * @param pixels
     * @returns {Uint8ClampedArray}
     */
    getImageData(x, y, scaleSize) {

        const { sw, sh } = scaleSize;
        // 复制画布上指定矩形的像素数据
        return this.targetContext.getImageData(x, y, sw, sh);
    }

    /**
     * 计算灰度图
     * @param imageData
     * @returns {*}
     */
    grayscale(imageData) {
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // 3 channel 灰度处理无空间压缩
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        return data;
    }
}
