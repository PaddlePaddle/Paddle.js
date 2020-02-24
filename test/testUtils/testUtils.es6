import 'babel-polyfill';
// import model from '../data/model.test2';
// import model from '../data/model.test.conv2d';
import GraphExecutor from '../../src/executor/executor';
import Loader from '../../src/executor/loader';
import Runtime from '../../src/runtime/runtime';
// 获取map表
import Map from '../data/map';
console.dir(['map', Map]);

const unitPath = {
    'conv2d': 'model.test.conv2d.json',
    'batchnorm': 'model.test.batchnorm.json',
    'mul': 'model.test.mul.json',
    'pool2d': 'model.test.pool2d.json',
    'relu': 'model.test.relu.json',
    'scale': 'model.test.scale.json',
    'softmax': 'model.test.softmax.json'
};
// 制定运行的 op
const modelType = 'conv2d';
const unitData = unitPath[modelType];

let Diff = require('./diff');
let datas;
let otherResult;
let output
async function run() {
    const path = 'test/unitData';

    const MODEL_CONFIG = {
        dir: `/${path}/`, // 存放模型的文件夹
        main: unitData, // 主文件
    };

    const graphModel= new Loader();
    const model = await graphModel.loadGraphModel(MODEL_CONFIG, {test: true});
    datas = model.handler;
    output = deepCopy(model.handler);
    // 测试单元
   // let item = getTensor('conv2d');
    func(model);
    // let inst = model.execute({input: cat});
    // console.dir(['result', inst.read()]);
}
run();

function deepCopy (data) {
    return JSON.parse(JSON.stringify(data));
}

// let output = deepCopy(datas);
let getTensor = function(id, times = 1) {
    let find = 0;
    let data = datas.ops.filter((item, idx) => {
        if (id === item.type) {
            ++find;
            if (find === times) {
                return true;
            }
        }
    });
    return getInputs(data[0]);
};

let getInputs = function(data) {

    Object.keys(data.inputs).forEach(function(key){
        data.inputs[key] = getValue(data.inputs[key][0], datas);

    });
    Object.keys(data.outputs).forEach(function(key){
        let out = getValue(data.outputs[key][0], datas)
        data.outputs[key] = out;
        otherResult = out[0].data;
    });
    return data;

};

let getResult = function(id) {
    let data = output.ops.filter((item, idx) => {
        if (id === item.type) {

            return true;
        }
    });
    return getoutputs(data[0]);
};
let getoutputs = function(data) {
    let otherResult;
    Object.keys(data.outputs).forEach(function(key){
        let out = getValue(data.outputs[key][0], output);
        otherResult = out[0].data;
    });
    return otherResult;
};

let getValue = function(name, datas) {
    return datas.vars.filter((item, idx) => {
        if (name === item.name) {
            return item;
        }
    });
};
// // 测试单元
// let item = getTensor('conv2d');

let func = function (model) {
    if (!model.inst) {
        model.inst = Runtime.init({
            'width_raw_canvas': 512,
            'height_raw_canvas': 512
        });
    }

    const executor = model.weightMap;
    model.execute_(executor[0]);
    console.dir(['result', model.inst.read()]);
    var one = model.inst.read();
    // var other = getResult('conv2d');

    console.log('one');
    console.log(one);
    console.log('other');
  //  console.log(other);


    // var one = inst.read();
    // var other = getResult('softmax');
    // var color ='';
    // var span = null;

    // var diff = Diff.diffChars(one.toString(), other.toString()),
    //     display = document.getElementById('display'),
    //     fragment = document.createDocumentFragment();
    //
    // diff.forEach(function(part){
    //     // green for additions, red for deletions
    //     // grey for common parts
    //     color = part.added ? 'green' :
    //         part.removed ? 'red' : 'grey';
    //     span = document.createElement('span');
    //     span.style.color = color;
    //     span.appendChild(document
    //         .createTextNode(part.value));
    //     fragment.appendChild(span);
    // });
    //
    // display.appendChild(fragment);

};

