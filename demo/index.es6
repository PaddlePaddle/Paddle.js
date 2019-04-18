import 'babel-polyfill';
import Graph from '../src/executor/loader';
import IO from '../src/feed/imageFeed';
import Utils from '../src/utils/utils';
// 获取map表
import Map from '../test/data/map';
/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 'http://mms-xr.cdn.bcebos.com/paddle/mnist/model.json'
// 统计参数
let loaded = false;
let model = {};
window.statistic = [];
async function run(input) {
    // const input = document.getElementById('mobilenet');
    const io = new IO();
    let feed = io.process({
        input: input,
        params: {
            scale: 256,
            width: 224, height: 224, // 压缩宽高
            shape: [3, 224, 224], // 预设tensor形状
            mean: [0.485, 0.456, 0.406], // 预设期望
            std: [0.229, 0.224, 0.225]  // 预设方差
        }});
    console.dir(['feed', feed]);
    const MODEL_URL = '/mobileNet/model.json';
    if (!loaded) {
        loaded = true;
        const graphModel= new Graph();
        model = await graphModel.loadGraphModel(MODEL_URL, {multipart: true, feed});
    }


    let inst = model.execute({input: feed});
    // 其实这里应该有个fetch的执行调用或者fetch的输出
    let result = inst.read();
    console.dir(['result', result]);

    let maxItem = Utils.getMaxItem(result);
    document.getElementById ("txt").innerHTML = Map['' + maxItem.index];
    console.log('识别出的结果是' + Map['' + maxItem.index]);
    console.dir(['每个op耗时', window.statistic]);
    let total = statistic.reduce((all, cur) => {
        return all + cur.runTime;
    }, 0);
    console.log('op total = ' + total);

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
document.getElementById ("uploadImg").onchange = function () {
    selectImage(this);
};
