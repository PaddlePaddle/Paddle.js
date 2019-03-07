import 'babel-polyfill';
import Graph from '../src/executor/graph_model';
import IO from '../src/executor/graph_io';
/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 'http://mms-xr.cdn.bcebos.com/paddle/mnist/model.json'
const MODEL_URL = '/model/model.json';
const graphModel= new Graph();
const model = graphModel.loadGraphModel(MODEL_URL);
const cat = document.getElementById('pic');
const io = new IO();
io.fromPixels(cat);

// model.execute({input: graph.browser.fromPixels(cat)});