/**
 * @file ocr_rec model
 */

import { Runner, Transformer } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
import DBProcess from './dbPostprocess';
import RecProcess from './recPostprocess';
import cv from '@paddlejs-mediapipe/opencv/library/opencv_ocr';
import { flatten, int, clip } from './util';

const DETSHAPE = 640;
const RECWIDTH = 320;
const RECHEIGHT = 32;
const canvas_det = document.createElement('canvas') as HTMLCanvasElement;
const canvas_rec = document.createElement('canvas') as HTMLCanvasElement;
let detectRunner = null as Runner;
let recRunner = null as Runner;

class OptModel extends Transformer {
    constructor() {
        super('OptModel');
    }

    transform(...args: any) {
        const [ops] = args;
        for (let opIndex = 0; opIndex < ops.length; opIndex++) {
            const op = ops[opIndex];
            if (op.type === 'pool2d' && op.attrs.pooling_type === 'avg') {
                op.type += '_avg';
            }
        }
    }
}

initCanvas(canvas_det);
initCanvas(canvas_rec);

function initCanvas(canvas) {
    canvas.style.position = 'fixed';
    canvas.style.bottom = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
}

export async function load() {
    detectRunner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/ocr_det',
        feedShape: {
            fw: DETSHAPE,
            fh: DETSHAPE
        },
        fill: '#fff',
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225],
        bgr: true
    });
    const detectInit = detectRunner.init();

    recRunner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/ocr_rec_crnn_320_new_1',
        feedShape: {
            fw: RECWIDTH,
            fh: RECHEIGHT
        },
        fill: '#000',
        mean: [0.5, 0.5, 0.5],
        std: [0.5, 0.5, 0.5],
        bgr: true,
        plugins: {
            preTransforms: [new OptModel()]
        }
    });
    const recInit = recRunner.init();

    return await Promise.all([detectInit, recInit]);
}

export async function detect(image) {
    // 目标尺寸
    const targetWidth = DETSHAPE;
    const targetHeight = DETSHAPE;
    canvas_det.width = targetWidth;
    canvas_det.height = targetHeight;
    // 通过canvas将上传原图大小转换为目标尺寸（640*640）
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
    const outsDict = await detectRunner.predict(canvas_det);
    const postResult = new DBProcess(outsDict, shapeList);
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

export async function drawBox(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    color?: string
) {
    const points = await detect(image);
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    points && points.forEach(point => {
        // 开始一个新的绘制路径
        ctx.beginPath();
        // 设置绘制线条颜色，默认为黑色
        ctx.strokeStyle = color || '#000';
        // 设置路径起点坐标
        ctx.moveTo(point[0][0], point[0][1]);
        ctx.lineTo(point[1][0], point[1][1]);
        ctx.lineTo(point[2][0], point[2][1]);
        ctx.lineTo(point[3][0], point[3][1]);
        ctx.closePath();
        ctx.stroke();
    });
}

export async function recognize(image: HTMLImageElement) {
    const point = await detect(image);
    const boxes = sorted_boxes(point);
    const text_list = [];
    for (let i = 0; i < boxes.length; i++) {
        const tmp_box = JSON.parse(JSON.stringify(boxes[i]));
        const img_crop = get_rotate_crop_image(image, tmp_box);
        const img_resize = resize_img(img_crop);
        canvas_det.width = img_resize.matSize[1];
        canvas_det.height = img_resize.matSize[0];
        cv.imshow(canvas_det, img_resize);
        const width_num = Math.ceil(canvas_det.width / RECWIDTH);
        let text_list_tmp = '';
        // 根据原图的宽度进行裁剪拼接
        for (let i = 0; i < width_num; i++) {
            resize_norm_img_splice(canvas_det, canvas_det.width, canvas_det.height, i);
            const output = await recRunner.predict(canvas_rec);
            const recResult = new RecProcess(output);
            const text = recResult.outputResult();
            text_list_tmp = text_list_tmp.concat(text.text);
        }
        text_list.push(text_list_tmp);
    }
    return { text: text_list, points: point };
}

function sorted_boxes(box) {
    function sortNumber(a, b) {
        return a[0][1] - b[0][1];
    }

    const boxes = box.sort(sortNumber);
    const num_boxes = boxes.length;
    for (let i = 0; i < num_boxes - 1; i++) {
        if (Math.abs(boxes[i + 1][0][1] - boxes[i][0][1]) < 10
            && boxes[i + 1][0][0] < boxes[i][0][0]) {
            const tmp = boxes[i];
            boxes[i] = boxes[i + 1];
            boxes[i + 1] = tmp;
        }
    }
    return boxes;
}

function get_rotate_crop_image(img: HTMLCanvasElement | HTMLImageElement, points: number[]) {
    const img_crop_width = int(Math.max(
        linalg_norm(points[0], points[1]),
        linalg_norm(points[2], points[3])
    ));
    const img_crop_height = int(Math.max(
        linalg_norm(points[0], points[3]),
        linalg_norm(points[1], points[2])
    ));

    const pts_std = [
        [0, 0],
        [img_crop_width, 0],
        [img_crop_width, img_crop_height],
        [0, img_crop_height]
    ];
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, flatten(points));
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, flatten(pts_std));
    // 获取到目标矩阵
    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const src = cv.imread(img);
    const dst = new cv.Mat();
    const dsize = new cv.Size(img_crop_width, img_crop_height);
    // 透视转换
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_CUBIC, cv.BORDER_REPLICATE, new cv.Scalar());
    const dst_img_height = dst.matSize[0];
    const dst_img_width = dst.matSize[1];

    let data = dst;
    if (dst_img_height / dst_img_width >= 1.5) {
        const dst_rot = new cv.Mat();
        const dsize_rot = new cv.Size(dst.rows, dst.cols);
        const center = new cv.Point(dst.cols / 2, dst.cols / 2);
        // 图像旋转
        const M = cv.getRotationMatrix2D(center, 90, 1);
        cv.warpAffine(dst, dst_rot, M, dsize_rot, cv.INTER_CUBIC, cv.BORDER_REPLICATE, new cv.Scalar());
        data = dst_rot;
    }
    return data;
}

function linalg_norm(x, y) {
    return Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
}

function resize_norm_img_splice(
    image: HTMLImageElement | HTMLCanvasElement,
    origin_width: number,
    origin_height: number,
    index = 0
) {
    canvas_rec.width = RECWIDTH;
    canvas_rec.height = RECHEIGHT;
    const ctx = canvas_rec.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.clearRect(0, 0, canvas_rec.width, canvas_rec.height);
    ctx.fillRect(0, 0, RECHEIGHT, RECWIDTH);
    ctx.drawImage(image, -index * RECWIDTH, 0, origin_width, origin_height);
}

function resize_img(src) {
    const dst = new cv.Mat();
    const dsize = new cv.Size(0, 0);
    const scale = RECHEIGHT / src.matSize[0];
    cv.resize(src, dst, dsize, scale, scale, cv.INTER_AREA);
    return dst;
}
