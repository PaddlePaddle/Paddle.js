import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/imageFeed';
import Utils from '../../src/utils/utils';
// 获取map表
import Map from '../../test/data/map';

const fileDownload = require('js-file-download');

/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 模型feed数据
const feedShape = {
    'gesture': {
        fw: 256,
        fh: 256
    }
};

// 模型fetch数据
const fetchShape = {
    'gesture': [1, 1000, 1, 1]
};

const modelType = 'gesture';
const {fw, fh} = feedShape[modelType];
const outputShape = fetchShape[modelType];

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
            targetSize: {
                height: fh,
                width: fw
            },
            scale: 256, // 缩放尺寸
            targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
            mean: [0.485, 0.456, 0.406],
            std: [0.229, 0.224, 0.225]
        }
    });

    const path = 'model/gesture';

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
                    fileCount: 2, // 切成了多少文件
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
    console.log(outputShape);
    let nhwcShape = [N, H, W, C];
    console.log(nhwcShape);
    console.log(result.length);

    let nchwData = Utils.nhwc2nchw(result, nhwcShape);
    Utils.stridePrint(nchwData);
    Utils.continuousPrint(nchwData);

    // for test
    // fileDownload(nchwData, "paddlejs-0.txt");

    let maxItem = Utils.getMaxItem(nchwData);
    console.log(maxItem);
    document.getElementById('txt').innerHTML = Map['' + maxItem.index];
    console.log('识别出的结果是' + Map['' + maxItem.index]);
};
var image = '';
function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (evt) {
        let img = document.getElementById('image');
        img.src = evt.target.result;
        img.onload = function() {
            run(img);
        };
        image = evt.target.result;
    }
    reader.readAsDataURL(file.files[0]);
}
// selectImage
document.getElementById("uploadImg").onchange = function () {
    selectImage(this);
};
