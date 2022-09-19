/**
 * @file ocr_detection model
 */
import { Runner, env } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
import DBProcess from './dbPostprocess';

interface FeedShape {
    fw: number;
    fh: number;
}
interface ModelConfig {
    modelPath?: string;
    fill: string;
    mean?: number[];
    std?: number[];
    bgr: boolean;
    feedShape?: FeedShape;
}

interface DetPostConfig {
    thresh: number;
    box_thresh: number;
    unclip_ratio: number;
}

interface NaturalSize {
    naturalWidth: number;
    naturalHeight: number;
}

const defaultFeedShape: FeedShape = {
    fw: 960,
    fh: 960
};


interface CanvasStyleOptions {
    strokeStyle?: string;
    lineWidth?: number;
    fillStyle?: string;
}

let DETSHAPE = 960;
const canvas_det = document.createElement('canvas') as HTMLCanvasElement;
const canvas_rec = document.createElement('canvas') as HTMLCanvasElement;

initCanvas(canvas_det);
initCanvas(canvas_rec);

function initCanvas(canvas) {
    canvas.style.position = 'fixed';
    canvas.style.bottom = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
}

const defaultModelConfig: ModelConfig = {modelPath: 'https://paddlejs.bj.bcebos.com/models/fuse/ocr/ch_PP-OCRv2_det_fuse_activation/model.json', 
                                        fill: '#fff',
                                        mean: [0.485, 0.456, 0.406],
                                        std: [0.229, 0.224, 0.225],
                                        bgr: true};

const defaultPostConfig: DetPostConfig = {thresh: 0.3, box_thresh: 0.6, unclip_ratio:1.5};

export class OCRDetection {
    modelConfig: ModelConfig = defaultModelConfig;
    feedShape: FeedShape = defaultFeedShape;
    runner: Runner = null;
    inputSize = {} as NaturalSize;
    scale: number;

    constructor(modelConfig?: ModelConfig) {
        this.modelConfig = Object.assign(this.modelConfig, modelConfig);
        this.feedShape = Object.assign(this.feedShape, modelConfig?.feedShape);
    }

    async init() {
        console.log(this.modelConfig.modelPath);
        console.log('debug');
        this.runner = new Runner(this.modelConfig);
        await this.runner.init();
    }

    preprocess(image: HTMLImageElement) {
        const targetWidth = DETSHAPE;
        const targetHeight = DETSHAPE;
        canvas_det.width = targetWidth;
        canvas_det.height = targetHeight;
        // 通过canvas将上传原图大小转换为目标尺寸
        const ctx = canvas_det.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, targetHeight, targetWidth);
        // 缩放后的宽高
        let sw = targetWidth;
        let sh = targetHeight;
        let x = 0;
        let y = 0;
        // target的长宽比大些 就把原图的高变成target那么高
        if (targetWidth / targetHeight * image.naturalHeight / image.naturalWidth >= 1) {
            sw = Math.round(sh * image.naturalWidth / image.naturalHeight);
            x = Math.floor((targetWidth - sw) / 2);
        }
        // target的长宽比小些 就把原图的宽变成target那么宽
        else {
            sh = Math.round(sw * image.naturalHeight / image.naturalWidth);
            y = Math.floor((targetHeight - sh) / 2);
        }
        ctx.drawImage(image, x, y, sw, sh);
        
        const shapeList = [DETSHAPE, DETSHAPE];

        let res = {x:x, y:y, shapeList: shapeList, image:image};
        return res;
    }    

    async detect(
        input: HTMLImageElement,
        PostConfig: DetPostConfig = defaultPostConfig
    ) {
        this.inputSize.naturalWidth = input.naturalWidth;
        this.inputSize.naturalHeight = input.naturalHeight;
        const insProcess = this.preprocess(input);
        const outsDict = await this.runner.predict(canvas_det);
        const polys = this.postprocessor(insProcess.image, outsDict, insProcess.shapeList, insProcess.x, insProcess.y, PostConfig);
        return polys;
    }

    postprocessor(image, outsDict, shapeList, x, y, PostConfig) {
        let thresh = PostConfig.thresh? PostConfig.thresh : 0.3;
        let box_thresh = PostConfig.box_thresh? PostConfig.box_thresh : 0.6;
        let unclip_ratio = PostConfig.unclip_ratio ? PostConfig.unclip_ratio: 1.5;
        const postResult = new DBProcess(outsDict, shapeList, thresh, box_thresh, unclip_ratio);
        // 获取坐标
        const result = postResult.outputBox();
        // 转换原图坐标
        const points = JSON.parse(JSON.stringify(result.boxes));
        // 框选调整大小
        const adjust = 8;
        points && points.forEach(item => {
            item.forEach((point, index) => {
                // 扩大框选区域，便于文字识别
                point[0] = clip(
                    (Math.round(point[0] - x) * Math.max(image.naturalWidth, image.naturalHeight) / DETSHAPE)
                    + (index === 0 ? -adjust : index === 1 ? adjust : index === 2 ? adjust : -adjust),
                    0,
                    image.naturalWidth
                );
                point[1] = clip(
                    (Math.round(point[1] - y) * Math.max(image.naturalWidth, image.naturalHeight) / DETSHAPE)
                    + (index === 0 ? -adjust : index === 1 ? -adjust : index === 2 ? adjust : adjust),
                    0,
                    image.naturalHeight
                );
            });
        });
        return points;
    }
}

function clip(data: number, min: number, max: number) {
    return data < min ? min : data > max ? max : data;
}
