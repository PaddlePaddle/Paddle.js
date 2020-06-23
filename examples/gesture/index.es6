// import 'babel-polyfill';
// import Paddlejs from '../../src/executor/runner';
import {runner as Paddlejs} from 'paddlejs';
import Camera from '../../src/executor/camera';
import DetectProcess from './DetectProcess';
import LMProcess from './LMProcess';
import WarpAffine from './warpAffine';

let image = '';
let camera = null;
let anchorResults = null;
const TYPE = 'video';

let rect = null;
let paddlejs = null;
let paddlejs2 = null;
const rectDom = document.getElementById('rect');
let video = document.getElementById('video');
const videoSelect = document.getElementById('videoSelect');
let upload = document.getElementById("uploadImg");
let loadingDom = document.getElementById("isLoading");

async function init() {
    paddlejs = new Paddlejs({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/gesture/gesture_detect',
        fileCount: 2,
        feedShape: {
            fw: 256,
            fh: 256
        },
        fetchShape: [1, 1, 1920, 10],
        needBatch: true,
        fill: '#fff',
        targetSize: { height: 256, width: 256 },
        needPostProcess: false
    });

    const waitPaddle1 = paddlejs.loadModel();
    paddlejs2 = new Paddlejs({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/gesture/gesture_rec',
        fileCount: 1,
        feedShape: {
            fw: 224,
            fh: 224
        },
        fetchShape: [1, 1, 1, 9],
        fill: '#fff',
        targetSize: { height: 224, width: 224 },
        needBatch: true,
        needPostProcess: false
    })

    const waitPaddle2 = paddlejs2.loadModel();

    WarpAffine.init({
        width: 224,
        height: 224
    });

    const waitAnchor  =  fetch(require('./anchor_small.txt')).then(async (res) => {
        anchorResults = await res.text();
        anchorResults = anchorResults.replace(/\s+/g, ',').split(',').map(item => +item);
    });

    Promise.all([waitPaddle1, waitPaddle2, waitAnchor]).then(() => {
        loadingDom.classList.add('hidden');
    })
}

init();
const imageDom = document.getElementById('image');
const content = document.getElementById('txt');
const videoToolDom = document.getElementById('video-tool');

(function main() {
    // 采用图片模式
    if (TYPE === 'image') {
        video.remove();
        videoToolDom.remove();
        loadingDom.remove();
        video = null;
    }
    // 采用视频模式
    else if (TYPE === 'video') {
        imageDom.remove();
        upload.remove();
        upload = null;
    }
})()

if (video) {
    camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video,
    });
    /* 获取摄像头并开始视频流 */
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
}

/* 循环跑模型 */
let loopFlag = true;
async function loop() {
    let input = camera.curVideo;
    if (loopFlag) {
        // setTimeout(async () => {
            await run(input);
        // }, 100);
    }
}

const startBtn = document.getElementById('start');
const endBtn = document.getElementById('end');
/* 视频开始播放时，开始模型预热 */
video && video.addEventListener('play', async function (e) {
    startBtn.disabled = false;
    startBtn.innerText = '开始测试';
});

/* 点击开始按钮，开始正式跑模型 */
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

/* 模型执行函数 */
async function run(input) {
    rect = video.getBoundingClientRect();
    await paddlejs.predict(input, postProcess);
}

function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    content.innerText = "识别中。。。";
    let reader = new FileReader();
    reader.onload = function (evt) {
        let img = document.getElementById('image');

        img.src = evt.target.result;
        img.onload = async function() {
            rect = img.getBoundingClientRect();
            paddlejs.predict(img, postProcess);
        };
        image = evt.target.result;
    }
    reader.readAsDataURL(file.files[0]);
}

// 第一个模型的后处理
async function postProcess(data) {
    let post = new DetectProcess(data, paddlejs.io.fromPixels2DContext.canvas);
    let box = await post.outputBox(anchorResults);
    if (!box) {
        console.info('box为空')
        rectDom.style.border = 'none';
        content.innerText = "识别不到手";
        TYPE === 'video' && loop();
        return;
    }
    content.innerText = "...";
    calculateBox();
    // TYPE === 'video' && loop();
    let feed = await post.outputFeed(paddlejs);
    // 第一个模型的后处理可以直接拿到feed
    paddlejs2.runWithFeed(feed, function (data) {
        // 开始第二个模型的后处理
        TYPE === 'video' && loop();
        let lmProcess = new LMProcess(data);
        lmProcess.output();
        content.innerText = "您出的是" + lmProcess.type;
    });

    function calculateBox() {
        let offsetX = 0;
        let offsetY = 0;

        if (rect.width < rect.height) {
            offsetX = rect.height - rect.width;
        }

        if (rect.width > rect.height) {
            offsetY = rect.width - rect.height;
        }

        let height = Math.abs(box[3][1] - box[0][1]);
        let width = Math.abs(box[1][0] - box[0][0]);

        let widthRatio = (rect.width + offsetX) / 256;
        let heightRatio = (rect.height + offsetY) / 256;

        let transformStr = `translate(${box[0][0] * widthRatio - offsetX / 2}px,
            ${box[0][1] * heightRatio - offsetY / 2}px) scale(${widthRatio * width / 100},
            ${heightRatio * height / 100})
        `;
        let cssObj = rectDom.style;
        cssObj.transform = transformStr;
        cssObj.border = "2px solid red";

        let rectStyle = {
            width:  width + 'px',
            height: height + 'px',
            left: box[0][0] + 'px',
            top: box[0][1] + 'px',
        }
    }
}

if (upload) {
    upload.onchange = async function () {
        selectImage(this);
    };
}
