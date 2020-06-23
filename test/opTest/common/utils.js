export function deepCopy (data) {
    return JSON.parse(JSON.stringify(data));
}


const getResult = function (id) {
    const data = output.ops.filter(item => id === item.type);
    return getoutputs(data[0]);
};

const getValue = function(name, datas) {
    return datas.vars.find(item => name === item.name);
};

const OUTPUT_KEYS = ['out', 'y', 'output'];
const getoutputs = function (data) {
    const outputkey = Object.keys(data.outputs).find(key => OUTPUT_KEYS.includes(key.toLowerCase()));
    const outputTensorId = data.outputs[outputkey].slice(-1)[0];
    const outputTensor = getValue(outputTensorId, output);

    return outputTensor;
};

// get output tensor shape
let output = null;
export function getOutputShape (outputData, modelType) {
    output = outputData;
    var outputTensor = getResult(modelType);
    return outputTensor.shape;
}

// NCHW shape 2 NHWC shape
export function nchwShape2nhwcShape(nchw) {
    let batchNCHW = nchw;
    if (nchw.length < 4) {
        let batch = [];
        for (let i = 0; i < (4 - nchw.length); i++) {
            batch.push(1);
        }
        batchNCHW = batch.concat(nchw);
    }

    const N = batchNCHW[0];
    const C = batchNCHW[1];
    const H = batchNCHW[2];
    const W = batchNCHW[3];

    return [N, H, W, C];
}

