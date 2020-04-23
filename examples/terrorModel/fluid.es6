/**
 * @file terrorModel 验证 fluid
 * @author zhangjingyuan02
 *
 */

import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/imageFeed';
import Utils from '../../src/utils/utils';
const fileDownload = require('js-file-download');

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
    'separate': {
        fw: 320,
        fh: 320
    }
};

const modelType = 'separate';
const {fw, fh} = feedShape[modelType];
// 统计参数
let loaded = false;
let model = null;

// 模型名字
const modelName = 'terrorModel';
// 模型网络输出shape
const outputShape = [1, 15, 1, 1];
// 模型分片
const fileCount = 3;

async function run(input) {
    // const input = document.getElementById('mobilenet');
    const io = new IO();
    let feed = io.process({
        input: input,
        params: {
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            scale: 256, // 缩放尺寸
            width: 224,
            height: 224, // 压缩宽高
            shape: [3, 224, 224], // 预设tensor形状
            mean: [0.485, 0.456, 0.406], // 预设期望
            std: [0.229, 0.224, 0.225]  // 预设方差
        }
    });

    // 生成 fluid 数据
    generareFluidData(feed);

    const path = `model/${modelName}`;

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
                    fileCount: 3, // 切成了多少文件
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

    let shape = model.graph.currentShape;
    shape = [1, 15, 1, 1];
    shape = Utils.padToFourDimShape(shape);
    let N = shape[0];
    let C = shape[1];
    let H = shape[2];
    let W = shape[3];
    const nhwc = [N, H, W, C];

    let nchwData = Utils.nhwc2nchw(result, nhwc);
    const formatData = Utils.formatReadData(nchwData, shape);
    fileDownload(formatData, 'data.txt');
}

function generareFluidData(feed) {
    let data = new Float32Array(3 * 224 * 224);
    for (let i = 0; i < 3 * 224 * 224; i++) {
        data = 1.0 + 0.0;
    }
    data = Utils.nchw2nhwc(data, [1, 3, 224, 224]);
    for (let i = 0; i < 3 * 224 * 224; i++) {
        feed[0].data[i] = 1;
    }
}

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
    };
    reader.readAsDataURL(file.files[0]);
}
// selectImage
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};
