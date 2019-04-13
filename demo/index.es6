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
async function run() {
    const MODEL_URL = '/mobileNet/model.json';
    const graphModel= new Graph();
    const model = await graphModel.loadGraphModel(MODEL_URL, {multipart: true});
    const input = document.getElementById('mobilenet');
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
    let inst = model.execute({input: feed});
    // 其实这里应该有个fetch的执行调用或者fetch的输出
    let result = inst.read();
    console.dir(['result', result]);

    let maxItem = Utils.getMaxItem(result);
    console.log('识别出的结果是' + Map['' + maxItem.index]);

}
run();
