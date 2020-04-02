import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import IO from '../../src/feed/imageFeed';
import Utils from '../../src/utils/utils';

const fileDownload = require('js-file-download');

/**
 * @file Terror model 入口文件
 * @author zhangjingyuan02
 *
 */

// 模型feed数据
const feedShape = {
    'terrorModel': {
        fw: 224,
        fh: 224
    }
};

// 统计参数
let loaded = false;
let model = null;

// 模型名字
const modelName = 'terrorModel';
// 模型网络输出shape
const outputShape = [1, 15, 1, 1];
// 模型分片
const fileCount = 3;
const {fw, fh} = feedShape[modelName];

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
                    fileCount: fileCount, // 切成了多少文件
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

    let nchwData = Utils.nhwc2nchw(result, nhwcShape);

    // 模型后置处理, infer的时候需要
    nchwData = Utils.softmax(nchwData);
    // 打印数据
    Utils.stridePrint(nchwData);
    Utils.continuousPrint(nchwData);

    // 生成详细类别得分
    const score12List = convertTo12class(nchwData);
    const detailClass = [
        '正常', '警察部队', '血腥', '尸体', '爆炸火灾', '杀人', '暴乱',
        '暴恐人物', '军事武器', '暴恐旗帜', '血腥动物或动物尸体', '车祸'
    ];
    // 详细分类得分
    const class12Score = [];
    detailClass.forEach((name, index) => {
        class12Score.push({
            name,
            score: score12List[index]
        });
    });

    // 生成简单类别得分
    const twoClass = ['正常', '暴恐'];
    const score2List = convertTo2class(nchwData);
    // 简单分类得分
    const class2Score = [];
    twoClass.forEach((name, index) => {
        class2Score.push({
            name,
            score: score2List[index]
        });
    });

    // 展示结果
    const maxItem = Utils.getMaxItem(score12List);
    const resName = detailClass[maxItem.index];
    const resPercent = toPercent(maxItem.value);
    document.querySelector('.result #name').innerHTML = resName;
    document.querySelector('.result #percent').innerHTML = resPercent;
    document.querySelector('.detector-result-container').style.display = 'block';
}

// 小数转百分比
function toPercent(data) {
    let str = Number(data * 100).toFixed(3);
    return str += '%';
}

function convertTo12class(scores) {
    return [
        scores[0] + scores[12], scores[10], scores[3], scores[2],
        scores[8], scores[1] + scores[7], scores[9], scores[5] + scores[6],
        scores[11], scores[4], scores[13], scores[14]
    ];
}

function convertTo2class(scores) {
    const totalScore = scores.reduce((acc, cur) => acc += cur, 0);
    let normalScore = scores[0] + scores[10] + scores[11] + scores[12] + scores[13];
    let terrorScore = totalScore - normalScore;
    return [
        normalScore,
        terrorScore
    ];
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
