import 'babel-polyfill';
import Graph from '../executor/loader';
import IO from '../executor/io';
/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 'http://mms-xr.cdn.bcebos.com/paddle/mnist/model.json'
const MODEL_URL = './model/model.json';
const graphModel= new Graph();
const model = graphModel.loadGraphModel(MODEL_URL);
const cat = document.getElementById('pic');
const io = new IO();

let func = async function () {
    let inst = await model.execute({input: cat});
    console.dir(['result', inst.read()]);
};
let startTime = Date.now();
func();
console.log('运行时间是' + (Date.now() - startTime));
