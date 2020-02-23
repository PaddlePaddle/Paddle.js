import 'babel-polyfill';
import Graph from '../../src/executor/loader';
/**
 * @file model demo mnist 入口文件
 * @author wangqun@baidu.com
 *
 */
// 'http://mms-xr.cdn.bcebos.com/paddle/mnist/model.json'
const path = 'model/mnist';
let model = {};
const graphModel = new Graph();
const cat = document.getElementById('pic');
const io = new IO();

async function run() {
    const MODEL_CONFIG = {
        dir: `/${path}/`, // 存放模型的文件夹
        main: 'model.json', // 主文件
    };
    const cat = document.getElementById('pic');
    model = await graphModel.loadGraphModel(MODEL_CONFIG, {
        multipart: false,
        feed: cat
    });


    // let inst = model.execute({input: cat});
    // let res = inst.read();
    // console.dir(['result', res]);
    // var fileDownload = require('js-file-download');
    // fileDownload(res, 'result.csv');
}
run();