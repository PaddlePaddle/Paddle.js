import 'babel-polyfill';
import Graph from '../src/executor/loader';
import IO from '../src/executor/io';
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

model.execute({input: io.fromPixels(cat)});