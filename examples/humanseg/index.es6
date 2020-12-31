import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/imageFeed';
import Utils from '../../src/utils/utils';
import cv from '../lib/opencv.js';
const fileDownload = require('js-file-download');

/**
 * @file model demo 入口文件
 * @author chenhaoze@baidu.com
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

let canvas1;
let canvas2;
let ctx;
let ctx2;

// 统计参数
let loaded = false;
let model = {};
window.statistic = [];
async function run(input) {
    const io = new IO();
    let feed = io.process({
        input: input,
        params: {
            gapFillWith: '#000', // 缩放后用什么填充不足方形部分
            scale: 192, // 缩放尺寸
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            mean: [122.675, 116.669, 104.008],
            std: [1.0, 1.0, 1.0],
            bgr: true
        }
    });

    const path = 'https://paddlejs.cdn.bcebos.com/models/humanseg';

    if (!loaded) {
        const MODEL_CONFIG = {
            dir: `${path}/`, // 存放模型的文件夹
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



    // let [w1, h1, width, height] = calSize(img);
    let img = document.getElementById('image');
    canvas1.width = 192;
    canvas1.height = 192;
    ctx.drawImage(img, 0, 0, 192, 192);
    let imageData = ctx.getImageData(0, 0, 192, 192);
    canvas2.width = img.naturalWidth;
    canvas2.height = img.naturalHeight;
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
    thresholdMask(dst, 0.4, 0.8);
    for (let i = 0; i < 36864; i++) {
        myImageData.data[i * 4 + 3] = dst.data[i * 4 + 3];
    }
    ctx.putImageData(myImageData, 0, 0);
    ctx2.drawImage(myCanvas, 0, 0, img.naturalWidth, img.naturalHeight);

    let temp = ctx2.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    myCanvas.width = img.naturalWidth;
    myCanvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    let origin = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    for (let i = 0; i < img.naturalHeight * img.naturalWidth; i++) {
        temp.data[i * 4] = origin.data[i * 4];
        temp.data[i * 4 + 1] = origin.data[i * 4 + 1];
        temp.data[i * 4 + 2] = origin.data[i * 4 + 2];
    }
    ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
    ctx2.putImageData(temp, 0, 0);
}

function thresholdMask(img, threshBg, threshFg) {
    for (let i = 0; i < img.data.length; i++) {
        let tmp = (img.data[i] - threshBg * 255.0) / (threshFg - threshBg);
        if (tmp < 0) {
            img.data[i] = 0;
        }
        else if (tmp > 255) {
            img.data[i] = 255;
        }
        else {
            img.data[i] = tmp;
        }
    }
}

var image = '';
function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (evt) {
        let img = document.getElementById('image');
        img.src = evt.target.result;
        img.onload = function () {
            run(img);
        };
        image = evt.target.result;
    };
    reader.readAsDataURL(file.files[0]);
}
// selectImage
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};


window.onload = function () {
    canvas1 = document.getElementById('myCanvas');
    ctx = canvas1.getContext('2d');
    canvas2 = document.getElementById('myCanvas2');
    ctx2 = canvas2.getContext('2d');
};