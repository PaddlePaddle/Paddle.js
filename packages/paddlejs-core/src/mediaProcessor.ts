/**
 * @file 处理图像相关输入
 */

import { InputFeed } from './commons/interface';
import env from './env';
import { nhwc2nchw } from './opFactory/utils';

type Color = string;

export default class MediaProcessor {
    targetContext: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
    targetCanvas: HTMLCanvasElement;
    gapFillWith: Color = '#fff';
    mean: number[] = [0, 0, 0];
    std: number[] = [1, 1, 1];
    bgr: boolean = false;
    pixelWidth: number = 1;
    pixelHeight: number = 1;
    inputFeed: InputFeed[] = [];

    constructor() {
        this.targetCanvas = env.get('canvas2d') || document.createElement('canvas') as HTMLCanvasElement;
        this.targetContext = this.targetCanvas.getContext('2d') as CanvasRenderingContext2D;
    };

    /**
     * 处理图像方法
     * @param inputs
     */
    process(media, modelConfig, feedShape): InputFeed[] {
        const { fill, mean, std, bgr, keepRatio = true } = modelConfig;
        const { fc = 3, fh, fw } = feedShape;
        const input = media;


        const params = {
            gapFillWith: fill || this.gapFillWith,
            mean: mean || this.mean,
            std: std || this.std,
            bgr: bgr || this.bgr,
            keepRatio,
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

        const input = pixels;
        const isImageElementLike = pixels.path && pixels.width && pixels.height;
        if (
            !isImageElementLike
            && !(pixels instanceof ImageBitmap
                || pixels instanceof HTMLVideoElement
                || pixels instanceof HTMLImageElement
                || pixels instanceof HTMLCanvasElement)
        ) {
            return [{
                data: data,
                shape: opt.shape || opt.targetShape,
                name: 'image',
                persistable: true
            }] as InputFeed[];
        }

        this.pixelWidth = (pixels as HTMLImageElement).naturalWidth || pixels.width;
        this.pixelHeight = (pixels as HTMLImageElement).naturalHeight || pixels.height;

        const inGPU = env.get('webgl_gpu_pipeline') || opt.webglFeedProcess;
        this.fitToTargetSize(isImageElementLike ? input.path : input, imageDataInfo, opt.keepRatio, inGPU);
        data = this.getImageData(imageDataInfo);
        // process imageData in webgl
        if (inGPU) {
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
    allReshapeToRGB(imageData, opt): Float32Array {
        // mean和std是介于0-1之间的
        const { mean, std, targetShape, bgr, normalizeType = 0 } = opt;
        const [, c, h, w] = targetShape;
        const data = imageData.data || imageData;
        const result = new Float32Array(h * w * c);
        let offset = 0;
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

        const nchwPixels: Float32Array = nhwc2nchw(result, [1, h, w, c]);
        return nchwPixels;
    }


    /**
     * 缩放成目标尺寸, keepRatio 为 true 则保持比例拉伸并居中，为 false 则变形拉伸为目标尺寸
     */
    fitToTargetSize(image, imageDataInfo, keepRatio = true, inGPU = false) {
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
        if (keepRatio) {
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
        }

        imageDataInfo.dWidth = canvasWidth;
        imageDataInfo.dHeight = canvasHeight;
        this.targetCanvas.width = canvasWidth;
        this.targetCanvas.height = canvasHeight;
        this.targetContext.fillStyle = imageDataInfo.gapFillWith;
        this.targetContext.fillRect(0, 0, canvasWidth, canvasHeight);
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

    cover(w, h, dw, dh) {
        // 缩放后的宽高
        let sw = dw;
        let sh = dh;
        // target的长宽比大些 就把原图的高变成target那么高
        if (dw / dh * h / w >= 1) {
            sw = Math.round(sh * w / h);
        }
        // target的长宽比小些 就把原图的宽变成target那么宽
        else {
            sh = Math.round(sw * h / w);
        }

        const scale = [sw / dw, sh / dh];
        return scale;
    }
}