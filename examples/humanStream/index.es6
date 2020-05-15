import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/imageFeed';
import Utils from '../../src/utils/utils';
import Camera from '../../src/executor/camera';
import Runner from '../../src/executor/runner';
import cv from '../../opencv.js';

function thresholdMask(img, threshBg, threshFg) {
    for (let i = 0; i < img.data.length / 4; i++) {
        let tmp = (img.data[i * 4 + 3] - threshBg * 255.0) / (threshFg - threshBg);
        if (tmp < 0) {
            img.data[i * 4 + 3] = 0;
        }
        else if (tmp > 255) {
            img.data[i * 4 + 3] = 255;
        }
        else {
            img.data[i * 4 + 3] = tmp;
        }
    }
}

if (location.protocol === 'http:') {
    location.href = location.href.replace('http://', 'https://');
}

/**
 * @file model demo 入口文件
 * @author zhuxingyu01@baidu.com
 *
 */
// 模型feed数据
const feedShape = {
    'humanseg': {
        fw: 192,
        fh: 192
    }
};

// 模型fetch数据
const fetchShape = {
    'humanseg': [1, 2, 192, 192]
};
const modelType = 'humanseg';
const {fw, fh} = feedShape[modelType];
const outputShape = fetchShape[modelType];

// 统计参数
let loaded = false;
let model = {};
window.statistic = [];

var video = document.getElementById('video');
const videoSelect = document.getElementById('videoSelect');

let camera = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: video,
    constraints: {
        video: {
            width: {min: 200, ideal: 480, max: 1080},
            height: {min: 300, ideal: 720, max: 1620}
        }
    }
});

camera.getDevices().then(devices => {
    if (devices.length) {
        camera.run(devices[0].deviceId);
        devices.forEach((element, index) => {
            let option = document.createElement('option');
            option.value = element.deviceId;
            option.text = (index + 1);
            videoSelect.appendChild(option);
        });
        videoSelect.onchange = () => {
            camera.run(videoSelect.value);
        };
    }
    else {
        camera.run();
    }
});


let loopFlag = true;

async function loop() {
    let input = camera.curVideo;
    if (loopFlag) {
        await run(input);
        await loop();
    }
}

let startBtn = document.getElementById('start');
let endBtn = document.getElementById('end');

video.addEventListener('play', async function (e) {
    await run();
    startBtn.disabled = false;
    startBtn.innerText = '开始测试';
})
// document.addEventListener("DOMContentLoaded", async function () {
//     // await run();
//     // startBtn.disabled = false;
// });

document.getElementById('tool').addEventListener('click', function(e) {
    if (e.target.id === 'start') {
        loopFlag = true;
        startBtn.disabled = true;
        endBtn.disabled = false;
        loop();
    }
    if (e.target.id === 'end') {
        loopFlag = false;
        endBtn.disabled = true;
        startBtn.disabled = false;
    }
})

async function run(input) {
    let start = Date.now();
    const io = new IO();
    let feed = input
    ? io.process({
        input: input,
        params: {
            gapFillWith: '#000', // 缩放后用什么填充不足方形部分
            scale: 192, // 缩放尺寸
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            mean: [122.675, 116.669, 104.008],
            std: [1.0, 1.0, 1.0],
            bgr: true
        }
    })
    : [{
        data: new Float32Array(3 * fh * fw),
        name: 'image',
        shape: [1, 3, fh, fw]
    }];

    const path = 'model/humanseg';

    if (!loaded) {
        const MODEL_CONFIG = {
            dir: `/${path}/`, // 存放模型的文件夹
            main: 'model.json', // 主文件
        };
        loaded = true;
        const paddle = new Paddle({
            urlConf: MODEL_CONFIG,
            options: {
                multipart: true,
                dataType: 'binary',
                options: {
                    fileCount: 1, // 切成了多少文件
                    getFileName(i) { // 获取第i个文件的名称
                        return 'chunk_' + i + '.dat';
                    }
                },
                feed
            }
        });
        model = await paddle.load();
    }
    let inst = model.execute({
        input: feed
    });

    if (!input) {
        return;
    }

    let result = await inst.read();

    let N = outputShape[0];
    let C = outputShape[1];
    let H = outputShape[2];
    let W = outputShape[3];
    let nhwcShape = [N, H, W, C];

    // console.dir(result);

    let nchwData = Utils.nhwc2nchw(result, nhwcShape);
    // Utils.stridePrint(nchwData);
    // Utils.continuousPrint(nchwData);

    let myCanvas = document.getElementById('myCanvas');
    let img = document.getElementById('video');
    myCanvas.width = 192;
    myCanvas.height = 192;
    let ctx = myCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 192, 192);
    let imageData = ctx.getImageData(0,0,192,192);
    let myCanvas2 = document.getElementById('myCanvas2');
    myCanvas2.width = img.videoWidth;
    myCanvas2.height = img.videoHeight;

    let ctx2 = myCanvas2.getContext("2d");
    var myImageData = ctx2.createImageData(192, 192);

    for (let i = 0; i < 36864; i++) {
        myImageData.data[i * 4] = (imageData.data[i * 4] - 255) * nchwData[36864 + i] + 255;
        myImageData.data[i * 4 + 1] = (imageData.data[i * 4 + 1] - 255) * nchwData[36864 + i] + 255;
        myImageData.data[i * 4 + 2] = (imageData.data[i * 4 + 2] - 255) * nchwData[36864 + i] + 255;
        myImageData.data[i * 4 + 3] = nchwData[36864 + i] * 255;
    }

    ctx.putImageData(myImageData, 0, 0);
    let logit = cv.imread(myCanvas);
    let dst = new cv.Mat();
    let ksize = new cv.Size(5, 5);
    let anchor = new cv.Point(-1, -1);
    cv.blur(logit, dst, ksize, anchor, cv.BORDER_DEFAULT);
    thresholdMask(dst, 0.2, 0.8);
    for (let i = 0; i < 36864; i++) {
        myImageData.data[i * 4 + 3] = dst.data[i * 4 + 3];
    }
    ctx.putImageData(myImageData, 0, 0);
    ctx2.drawImage(myCanvas, 0, 0, img.videoWidth, img.videoHeight);
    let temp = ctx2.getImageData(0, 0, img.videoWidth, img.videoHeight);
    myCanvas.width = img.videoWidth;
    myCanvas.height = img.videoHeight;
    ctx.drawImage(img, 0, 0);
    let origin = ctx.getImageData(0, 0, img.videoWidth, img.videoHeight);
    for (let i = 0; i < img.videoHeight * img.videoWidth; i++) {
        temp.data[i * 4] = origin.data[i * 4];
        temp.data[i * 4 + 1] = origin.data[i * 4 + 1];
        temp.data[i * 4 + 2] = origin.data[i * 4 + 2];
    }
    ctx.clearRect(0, 0, img.videoWidth, img.videoHeight);
    ctx2.clearRect(0, 0, img.videoWidth, img.videoHeight);
    ctx2.putImageData(temp, 0, 0);
};
