import 'babel-polyfill';
import model from '../data/model.test';
import GraphExecutor from '../../src/executor/executor';
import Runtime from '../../src/runtime/runtime';

let Diff = require('./diff');
let datas = model;

function deepCopy (data) {
    return JSON.parse(JSON.stringify(data));
}
let otherResult;
let output = deepCopy(datas);
let getTensor = function(id) {
    let data = datas.ops.filter((item, idx) => {
        if (id === item.type) {

            return true;
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

let item = getTensor('softmax');



let func = async function () {
    let inst = Runtime.init({
        'width_raw_canvas': 512,
        'height_raw_canvas': 512
    });
    const executor = new GraphExecutor(item);
    await executor.execute(executor, {}, inst);
    console.dir(['result', inst.read()]);


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
func();
