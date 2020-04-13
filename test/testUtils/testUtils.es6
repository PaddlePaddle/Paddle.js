import 'babel-polyfill';
import Paddle from '../../src/paddle/paddle';
import Utils from '../../src/utils/utils';

const unitPath = {
    'conv2d': 'model.test.conv2d.json',
    'batchnorm': 'model.test.batchnorm.json',
    'mul': 'model.test.mul.json',
    'pool2d': 'model.test.pool2d.json',
    'relu': 'model.test.relu.json',
    'scale': 'model.test.scale.json',
    'softmax': 'model.test.softmax.json',
    'relu6' : 'model.test.relu6.json',
	'elementwise' : 'model.test.elementwise_add.json',
	'depthwise' : 'model.test.depthwise_conv2d.json',
	'reshape' : 'model.test.reshape.json',
	'bilinear_interp' : 'model.test.bilinear_interp.json',
	'transpose' : 'model.test.transpose.json',
	'conv2d_transpose': 'model.test.conv2d_transpose.json',
	'elementwise_add': 'model.test.elementwise_add.json',
    'concat': 'model.test.concat.json',
    'split': 'model.test.split.json'
};
// 制定运行的 op
const modelType = 'split';
// 制定运行的 op
const unitData = unitPath[modelType];

let datas;
let output;
async function run() {
    const path = 'test/unitData';
    const MODEL_CONFIG = {
        dir: `/${path}/`, // 存放模型的文件夹
        main: unitData, // 主文件
    };

    const paddle = new Paddle({
        urlConf: MODEL_CONFIG,
        options: {
            test: true
        }
    });

    let model = await paddle.load();
    datas = model.graph.data;

    output = deepCopy(datas);

    model.graph.weightMap.forEach(op => {
        const type = op.type;
        if (type !== 'feed' && type !== 'fetch') {
            console.log(op.type);
            model.graph.buildOpData(op);
        }
    });
    const executor = model.graph.weightMap;
    model.graph.execute_(executor[0]);

    // NHWC输出
    let result = await model.graph.inst.read();

    // 获取 NHWC -> NCHW 的 输出
    const outputNCHWShape = getOutputShape();
    const outputNHWCShape = nchwShape2nhwcShape(outputNCHWShape);
    let nchwResult = Utils.nhwc2nchw(result, outputNHWCShape);

    console.log('result');
    console.log(result);

    console.log('NCHW RESULT');
    console.log(nchwResult);
}

run();

function deepCopy (data) {
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

function getOutputShape () {
    var outputTensor = getResult(modelType);
    return outputTensor.shape;
}

// NCHW shape 2 NHWC shape
function nchwShape2nhwcShape(nchw) {
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
