import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/ImageFeed';
import Utils from '../../src/utils/utils';
// 获取map表
// import Map from '../../test/data/map';
let map = {};
const fileDownload = require('js-file-download');

/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 模型feed数据
const feedShape = {
    'mobilenetv2': {
        fw: 224,
        fh: 224
    }
};

// 模型fetch数据
const fetchShape = {
    'mobilenetv2': [1, 1000, 1, 1]
};

const modelType = 'mobilenetv2';
const {fw, fh} = feedShape[modelType];
const outputShape = fetchShape[modelType];

// 统计参数
let loaded = false;
let model = {};
window.statistic = [];
let loading = document.getElementsByClassName('data-loading');
let modelTxt = document.getElementById('model-txt');

async function run(input) {
    // const input = document.getElementById('mobilenet');
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

    const path = 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2';

    if (!loaded) {

        fetch(path + '/map.json')
            .then(response => response.json())
            .then(data => (map = data));
        const MODEL_CONFIG = {
            dir: `${path}/`, // 存放模型的文件夹
            main: 'model.json', // 主文件
        };
        loaded = true;
        modelTxt.style.visibility = 'visible';
        loading[0].style.visibility = 'visible';
        const paddle = new Paddle({
            urlConf: MODEL_CONFIG,
            options: {
                multipart: true,
                dataType: 'binary',
                options: {
                    // fileCount: 4, // 切成了多少文件
                    getFileName(i) { // 自定义chunk文件名，获取第i个文件的名称
                        return 'chunk_' + i + '.dat';
                    }
                },
                feed
            }
        });
        model = await paddle.load();
        loading[0].style.visibility = 'hidden';
        modelTxt.innerText = '模型加载完成！';
    }
    loading[1].style.visibility = 'visible';
    loading[2].style.visibility = 'visible';
    window.statistic.startTime = (+new Date());
    let inst = model.execute({
        input: feed
    });

    let result = await inst.read();
    loading[1].style.visibility = 'hidden';
    loading[2].style.visibility = 'hidden';
    window.statistic.endTime = (+new Date()) - window.statistic.startTime;
    let N = outputShape[0];
    let C = outputShape[1];
    let H = outputShape[2];
    let W = outputShape[3];
    let nhwcShape = [N, H, W, C];
    console.log(nhwcShape);

    let nchwData = Utils.nhwc2nchw(result, nhwcShape);
    Utils.stridePrint(nchwData);
    Utils.continuousPrint(nchwData);

    // for test
    // fileDownload(nchwData, "paddlejs-0.txt");

    let maxItem = Utils.getMaxItem(nchwData);
    console.log(maxItem);
    document.getElementById('txt').innerHTML = map['' + maxItem.index];
    document.getElementById('all-performance-time').innerHTML = '计算时间是' + window.statistic.endTime;
    console.log('识别出的结果是' + map['' + maxItem.index]);
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
