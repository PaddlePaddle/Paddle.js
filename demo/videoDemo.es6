import 'babel-polyfill';
import Graph from '../src/executor/loader';
import IO from '../src/feed/ImageFeed';
// import Utils from '../src/utils/utils';
import {testRun} from '../src/executor/postProcess';
// import Map from '../test/data/map';
import Logger from '../tools/logger';
window.log = new Logger();

// 统计参数
let loaded = false;
let model = {};
window.statistic = [];
window.badCases = [];
window.currentPic = '';

let runFlag = true;

// =====
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
    }
};
// 模型路径
const modelPath = {
    '608': 'faceModel',
    '320': 'facemodel320',
    '320fused': 'facemodelfused'
};
const modelType = '320';
const path = modelPath[modelType];
const {fw, fh} = feedShape[modelType];
const {from, to} = outputShapes[modelType];
window.conf = {
    fw,
    from,
    to
}
// =====


// 访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        // 最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    }
    else if (navigator.webkitGetUserMedia) {
        // webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
    }
    else if (navigator.mozGetUserMedia) {
        // firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    }
    else if (navigator.getUserMedia) {
        // 旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

function success(stream) {
    // 兼容webkit核心浏览器
    let CompatibleURL = window.URL || window.webkitURL;
    // 将视频流设置为video元素的源

    // video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    video.play();
}

function error(error) {
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}

if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) {
    // 调用用户媒体设备, 访问摄像头
    getUserMedia({
        video: {
            width: 480,
            height: 320,
            frameRate: {
                ideal: 8, max: 15
            }
        }
    }, success, error);
}
else {
    alert('不支持访问用户媒体');
}

// 第一遍执行比较慢 所以预热一下
async function preheat() {
    document.getElementById('start').disabled = true;
    const io = new IO();
    let feed = io.process({
        input: video,
        params: {
            gapFillWith: '#000', // 缩放后用什么填充不足方形部分
            targetSize: {
                height: fw,
                width: fh
            },
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            // shape: [3, 608, 608], // 预设tensor形状
            mean: [117.001, 114.697, 97.404], // 预设期望
            // std: [0.229, 0.224, 0.225]  // 预设方差
        }
    });
    const MODEL_URL = `/${path}/model.json`;
    const MODEL_CONFIG = {
        dir: `/${path}/`, // 存放模型的文件夹
        main: 'model.json', // 主文件
    };
    loaded = true;
    const graphModel = new Graph();
    log.start('加载模型');
    model = await graphModel.loadGraphModel(MODEL_CONFIG, {
        multipart: true,
        dataType: 'binary',
        binaryOption: {
            fileCount: 1, // 切成了多少文件
            getFileName(i) { // 获取第i个文件的名称
                return 'chunk_0.dat';
            }
        },
        feed
    });
    log.end('加载模型');
    let inst = model.execute({
        input: feed
    });
    document.getElementById('start').disabled = false;
}

async function run(input) {
    // const input = document.getElementById('mobilenet');
    log.start('总耗时');
    const io = new IO();
    log.start('预处理');
    let feed = io.process({
        input: input,
        params: {
            gapFillWith: '#000', // 缩放后用什么填充不足方形部分
            targetSize: {
                height: fw,
                width: fh
            },
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            // shape: [3, 608, 608], // 预设tensor形状
            mean: [117.001, 114.697, 97.404], // 预设期望
            // std: [0.229, 0.224, 0.225]  // 预设方差
        }
    });
    log.end('预处理');

    log.start('运行耗时');
    let inst = model.execute({
        input: feed
    });
    log.end('运行耗时');
    log.start('后处理');
    log.start('后处理-读取数据');
    // 其实这里应该有个fetch的执行调用或者fetch的输出
    let result = inst.read();
    log.end('后处理-读取数据');
    // console.dir(['result', result]);
    log.start('后处理-形状调整');
    const newData = [];
    let newIndex = -1;
    const [w, h, c, b] = outputShapes[modelType].from;
    // c channel
    for (let i = 0; i < c; i++) {
        // height channel
        for (let j = 0; j < h; j++) {
            // width channel
            for (let k = 0; k < w; k++) {
                // position: (0, 0, 0, 0)
                const index = j * (c * h) + k * c + i;
                // const index = j * (i * k) + k * i + i;
                newData[++newIndex] = result[index];
            }
        }
    }
    log.end('后处理-形状调整');
    log.start('后处理-画框');
    testRun(newData, input);
    log.end('后处理-画框');
    log.end('后处理');
    log.end('总耗时');
    return Promise.resolve();
}

async function start() {
    log.during('每次执行的时间间隔');
    await run(video);
    if (runFlag) {
        setTimeout(async function () {
            await start();
        }, 0);
    }
}

document.getElementById('start').addEventListener('click', function () {
    runFlag = true;
    start();
    // context.drawImage(video, 0, 0, 480, 320);
});

document.getElementById('stop').addEventListener('click', function () {
    runFlag = false;
    // context.drawImage(video, 0, 0, 480, 320);
});

preheat();
