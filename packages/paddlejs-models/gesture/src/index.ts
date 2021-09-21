/**
 * @file gesture model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
import WarpAffine from './warpAffine';
import DetectProcess from './detectProcess';
import LMProcess from './LMProcess';
import anchor from '!!raw-loader!./anchor_small.txt';

let box = null;
let detectRunner = null as Runner;
let recRunner = null as Runner;
let anchorResults = null;
const detFeedShape = 256;
const recFeedShape = 224;
const canvas = document.createElement('canvas') as HTMLCanvasElement;
initCanvas();

function initCanvas() {
    canvas.width = detFeedShape;
    canvas.height = detFeedShape;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
}

export async function load() {
    anchorResults = anchor.replace(/\s+/g, ',').split(',').map(item => +item);

    detectRunner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/gesture_detection',
        feedShape: {
            fw: detFeedShape,
            fh: detFeedShape
        },
        fill: '#fff'
    });
    const detectInit = detectRunner.init();

    recRunner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/gesture_recognization',
        feedShape: {
            fw: recFeedShape,
            fh: recFeedShape
        },
        fill: '#fff'
    });
    const recInit = recRunner.init();

    WarpAffine.init({
        width: 224,
        height: 224
    });

    return await Promise.all([detectInit, recInit]);
}

export async function classify(image) {
    canvas.getContext('2d').drawImage(image, 0, 0, detFeedShape, detFeedShape);
    const res = await detectRunner.predict(image);
    const post = new DetectProcess(res, canvas);
    const result = {
        box: '',
        type: ''
    };
    box = await post.outputBox(anchorResults);
    if (box) {
        // 手势框选位置
        result.box = box;
        const feed = await post.outputFeed(recRunner);
        const res2 = await recRunner.predictWithFeed(feed);
        const lmProcess = new LMProcess(res2);
        lmProcess.output();
        // 识别结果
        result.type = lmProcess.type || '';
    }
    return result;
}
