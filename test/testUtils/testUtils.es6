import 'babel-polyfill';
import model from '../data/model.test';
import GraphExecutor from '../../src/executor/executor';
import Runtime from '../../src/runtime/runtime';

let datas = model;

const deepClone=(obj)=>{
    var proto=Object.getPrototypeOf(obj);
    return Object.assign({},Object.create(proto),obj);
}
let output = deepClone(datas);
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
            data.inputs[key] = getValue(data.inputs[key][0]);

        });
        Object.keys(data.outputs).forEach(function(key){
            let out = getValue(data.outputs[key][0])
            data.outputs[key] = out;
            data.diff = out[0].data;
            console.log(data.diff)

        });
    return data;

};

let getValue = function(name) {
    return datas.vars.filter((item, idx) => {
        if (name === item.name) {
            return item;
        }
    });
};

let item = getTensor('conv2d');



let func = async function () {
    let inst = Runtime.init({
        'width_raw_canvas': 512,
        'height_raw_canvas': 512
    });
    const executor = new GraphExecutor(item);
    await executor.execute(executor, {}, inst);
    console.dir(['result', inst.read()]);
};
func();