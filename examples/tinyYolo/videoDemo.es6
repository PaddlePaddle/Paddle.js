import 'babel-polyfill';
import Runner from '../../src/executor/runner';
import Camera from '../../src/executor/camera';
import postProcess from './util';

/* 循环跑模型 */
let loopFlag = true;
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

const outputShape = {
    from: [10, 10, 25, 1],
    to: [10, 10, 5, 5]
}
// 模型feed数据
const fw = 320;
const fh = 320;
const feedShape = {fw, fh};

const paddlejs = new Runner({
    // 用哪个模型
    fileCount: 1,
    modelPath: 'https://paddlejs.cdn.bcebos.com/models/tinyYolo',
    fill: '#000', // 缩放后用什么填充不足方形部分
    targetSize: {
        height: fw,
        width: fh
    },
    targetShape: [1, 3, fw, fh], // 目标形状 为了兼容之前的逻辑所以改个名
    feedShape,
    fetchShape: [1, 25, 10, 10],
    mean: [117.001 / 255, 114.697 / 255, 97.404 / 255], // 预设期望
    std: [1, 1, 1],
    needBatch: true,
    needPostProcess: false
});

paddlejs.loadModel()
    .then(() =>{
        startBtn.disabled = false;
    });

const domElement = document.getElementById('video');
const videoSelect = document.getElementById('videoSelect');

let camera = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: domElement
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

startBtn.addEventListener('click', function () {
    startBtn.disabled = true;
    loopFlag = true;
    loop();
});
stopBtn.addEventListener('click', function () {
    startBtn.disabled = false;
    loopFlag = false;
});

async function loop() {
    let input = camera.curVideo;
    console.log(input)
    if (loopFlag) {
        await run(input);
    }
}

async function run(input) {
    await paddlejs.predict(input, (data) => {
        postProcess(data, input, fw, outputShape, [10, -100]);
        loop();
    });
}
