/**
 * @file ocr_det model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
import DBProcess from './dbPostprocess';

const DETSHAPE = 640;
const canvas = document.createElement('canvas') as HTMLCanvasElement;
let detectRunner = null as Runner;

// 通过canvas将上传原图大小转换为目标尺寸（640*640）
initCanvas(canvas);

function initCanvas(canvas) {
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
}

export async function load() {
    detectRunner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/ocr_mobile_v2.0',
        feedShape: {
            fw: DETSHAPE,
            fh: DETSHAPE
        },
        fill: '#fff',
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225],
        bgr: true
    });
    await detectRunner.init();
}

export async function detect(image) {
    // 目标尺寸
    const targetWidth = DETSHAPE;
    const targetHeight = DETSHAPE;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
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
    const outsDict = await detectRunner.predict(canvas);
    const postResult = new DBProcess(outsDict, shapeList);
    // 获取坐标
    const result = postResult.outputBox();
    // 转换原图坐标
    const points = JSON.parse(JSON.stringify(result.boxes));
    points && points.forEach(item => {
        item.forEach(point => {
            // 保证原图坐标不超出图片
            point[0] = clip(
                (Math.round(point[0] - x) * Math.max(image.naturalWidth, image.naturalHeight) / DETSHAPE),
                0,
                image.naturalWidth
            );
            point[1] = clip(
                (Math.round(point[1] - y) * Math.max(image.naturalWidth, image.naturalHeight) / DETSHAPE),
                0,
                image.naturalHeight
            );
        });
    });
    return points;
}

function clip(data: number, min: number, max: number) {
    return data < min ? min : data > max ? max : data;
}
