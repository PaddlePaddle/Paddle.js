import 'babel-polyfill';
import Graph from '../src/executor/loader';
import IO from '../src/feed/imageFeed';
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
    io.process({
        input: input,
        params: {
            width: 224, height: 224,
            shape: [3, 224, 224],
            mean: [0.485, 0.456, 0.406],
            std: [0.229, 0.224, 0.225]
            // img_mean 0.485, 0.456, 0.406
            //img_std 0.229, 0.224, 0.225
        }});
    let inst = model.execute({input: cat});
    // console.dir(['result', inst.read()]);
}
run();