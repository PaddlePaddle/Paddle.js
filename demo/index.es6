import 'babel-polyfill';
import graph from '../src/executor/graph_model';
/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 'http://mms-xr.cdn.bcebos.com/paddle/mnist/model.json'
const MODEL_URL = '/model/model.json';
let graphModel= new graph();
const model = graphModel.loadGraphModel(MODEL_URL);
// const cat = document.getElementById('cat');
// model.execute({input: graph.browser.fromPixels(cat)});