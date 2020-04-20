import 'babel-polyfill';
import Runner from '../../src/executor/runner';
import Camera from '../../src/executor/camera';
// 调试工具
// import vConsole from 'vconsole';
// const theConsole = new vConsole();
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop')
// 模型输出shape
const outputShapes = {
    '608': {
        from: [19, 19, 25, 1],
        to: [19, 19, 5, 5]
    },
    '320': {
        from: [10, 10, 25, 1],
        to: [10, 10, 5, 5]
    },
    '320fused': {
        from: [10, 10, 25, 1],
        to: [10, 10, 5, 5]
    },
    'tinyYolo': {
        from: [10, 10, 25, 1],
        to: [10, 10, 5, 5]
    }
};
// 模型feed数据
const feedShape = {
    '608': {
        fw: 608,
        fh: 608
    },
    '320': {
        fw: 320,
        fh: 320
    },
    '320fused': {
        fw: 320,
        fh: 320
    },
    'tinyYolo': {
        fw: 320,
        fh: 320
    }
};
const modelPath = {
    'tinyYolo': 'model/tinyYolo'
};
const modelType = 'tinyYolo';
const path = modelPath[modelType];

const runner = new Runner({
    // 用哪个模型
    modelName: modelType, // '608' | '320' | '320fused' | 'separate'
    modelPath: path,
    feedShape: feedShape[modelType],
    outputShapes: outputShapes[modelType]
});
startBtn.disabled = true;
runner.preheat()
    .then(() =>{
        startBtn.disabled = false;
    });

const domElement = document.getElementById('video');
const myCanvas = document.getElementById('myDiv');
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
const handleDiv = function (data) {
    myCanvas.style.width = (data ? data[0] : 0) + 'px';
    myCanvas.style.height = (data ? data[0] : 0) + 'px';
    myCanvas.style.left = (data ? data[2] : 0) + 'px';
    myCanvas.style.top = (data ? data[3] : 0) + 'px';
}
startBtn.addEventListener('click', function () {
    startBtn.disabled = true;
    runner.startStream(() => camera.curVideo, handleDiv);
});
stopBtn.addEventListener('click', function () {
    startBtn.disabled = false;
    runner.stopStream();
});