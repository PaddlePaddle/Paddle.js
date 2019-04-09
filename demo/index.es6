import 'babel-polyfill';
import Graph from '../src/executor/loader';
import IO from '../src/executor/io';
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
    const cat = document.getElementById('pic');
    const io = new IO();

    let inst = model.execute({input: cat});
    let result = inst.read();
    console.dir(['result', result]);
    let maxItem = Utils.getMaxItem(result);
    console.log('识别出的结果是' + Map['' + maxItem.index]);
}
run();
