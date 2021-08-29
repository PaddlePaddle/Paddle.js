/**
 * @file 处理图像相关输入
 */

import { InputFeed } from './commons/interface';
import env from './env';

type Color = string;

export default class MediaProcessor {
    targetContext: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
    gapFillWith: Color = '#fff';
    mean: number[] = [0, 0, 0];
    std: number[] = [1, 1, 1];
    bgr: boolean = false;
    pixelWidth: number = 1;
    pixelHeight: number = 1;
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
        const { feedShape, fill, mean, std, bgr } = modelConfig;
        const { fc = 3, fh, fw } = feedShape;
        const input = media;


        const params = {
            gapFillWith: fill || this.gapFillWith,
            mean: mean || this.mean,
            std: std || this.std,
            bgr: bgr || this.bgr,
            targetSize: {
                width: fw,
                height: fh
            },
            targetShape: [1, fc, fh, fw]
        };

        return this.fromPixels(input, params) || [];
    }

    fromPixels(pixels, opt): InputFeed[] {
        let data: ImageData | number[] | Float32Array = [];
        const imageDataInfo = {
            gapFillWith: opt.gapFillWith,
            dx: 0,
            dy: 0,
            dWidth: opt.targetSize.width,
            dHeight: opt.targetSize.height
        };

        if (!(pixels instanceof HTMLImageElement
            || pixels instanceof HTMLVideoElement
            || pixels instanceof HTMLCanvasElement)) {
            return [{
                data: data,
                shape: opt.shape || opt.targetShape,
                name: 'image',
                persistable: true
            }] as InputFeed[];
        }

        this.pixelWidth = pixels.width;
        this.pixelHeight = pixels.height;


        this.fitToTargetSize(pixels, imageDataInfo, env.get('webgl_feed_process'));
        data = this.getImageData(imageDataInfo);
        // process imageData in webgl
        if (env.get('webgl_feed_process')) {
            data = Float32Array.from((data as ImageData).data);
            return [{
                data,
                shape: [1, 1, imageDataInfo.dHeight, imageDataInfo.dWidth],
                name: 'image',
                persistable: true
            }] as InputFeed[];
        }


        data = this.allReshapeToRGB(data, opt) as Float32Array;
        return [{
            data,
            shape: opt.targetShape || opt.shape,
            name: 'image',
            persistable: true
        }] as InputFeed[];
    }


    /**
     * 全部转rgb * H * W
     * @param imageData 数据
     * @param opt 参数
     * @param opt.mean 均值
     * @param opt.std 方差
     * @param opt.targetShape 输出shape
     */
    allReshapeToRGB(imageData, opt) {
        // mean和std是介于0-1之间的
        const { mean, std, targetShape, bgr } = opt;
        const [, c, h, w] = targetShape;
        const data = imageData.data || imageData;
        const result = new Float32Array(h * w * c);
        let offset = 0;
        // 将数据映射为0~1， 1：映射为-1~1之间
        const normalizeType = 0;
        // h w c
        for (let i = 0; i < h; ++i) {
            const iw = i * w;
            for (let j = 0; j < w; ++j) {
                const iwj = iw + j;
                for (let k = 0; k < c; ++k) {
                    const a = bgr ? iwj * 4 + (2 - k) : iwj * 4 + k;
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
     * 缩放成目标尺寸并居中
     */
    fitToTargetSize(image, imageDataInfo, inGPU = false) {
        // 目标尺寸
        const targetWidth = imageDataInfo.dWidth;
        const targetHeight = imageDataInfo.dHeight;

        let canvasWidth = inGPU ? this.pixelWidth : targetWidth;
        let canvasHeight = inGPU ? this.pixelHeight : targetHeight;
        // 缩放后的宽高
        let sw = inGPU ? this.pixelWidth : targetWidth;
        let sh = inGPU ? this.pixelHeight : targetHeight;
        let x = 0;
        let y = 0;
        // target的长宽比大些 就把原图的高变成target那么高
        if (targetWidth / targetHeight * this.pixelHeight / this.pixelWidth >= 1) {
            if (inGPU) {
                canvasWidth = Math.round(sh * targetWidth / targetHeight);
                x = Math.floor((canvasWidth - sw) / 2);
            }
            else {
                sw = Math.round(sh * this.pixelWidth / this.pixelHeight);
                x = Math.floor((targetWidth - sw) / 2);
            }
        }
        // target的长宽比小些 就把原图的宽变成target那么宽
        else {
            if (inGPU) {
                canvasHeight = Math.round(sw * targetHeight / targetWidth);
                y = Math.floor((canvasHeight - sh) / 2);
            }
            else {
                sh = Math.round(sw * this.pixelHeight / this.pixelWidth);
                y = Math.floor((targetHeight - sh) / 2);
            }
        }

        imageDataInfo.dWidth = canvasWidth;
        imageDataInfo.dHeight = canvasHeight;
        this.targetContext.canvas.width = canvasWidth;
        this.targetContext.canvas.height = canvasHeight;
        this.targetContext.fillStyle = imageDataInfo.gapFillWith;
        this.targetContext.fillRect(0, 0, canvasHeight, canvasWidth);
        this.targetContext.drawImage(image, x, y, sw, sh);
    }

    /**
     * 获取图像内容
     * @param pixels
     * @returns {Uint8ClampedArray}
     */
    getImageData(imageDataInfo) {

        const { dx, dy, dWidth, dHeight } = imageDataInfo;
        // 复制画布上指定矩形的像素数据
        return this.targetContext.getImageData(dx, dy, dWidth, dHeight);
    }

}