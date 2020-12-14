import { Runner } from 'paddlejs-core/src/index';
import registerWebGPUBackend from '../../src/index';

const opName = 'concat_mul';
const modelDir = `/test/op/data/`;
const modelPath = `${modelDir}${opName}.json`;

const OP_INFO_MAP = {
    'conv2d': {
        name: 'conv2d_0.tmp_0',
        shape: [
            1,
            4,
            2,
            2
        ]
    },
    'elementwise_add': {
        name: 'fc_0.tmp_1',
        shape: [
            3, 2 ,2
        ]
    },
    'mul': {
        name: 'fc_0.tmp_0',
        shape: [2, 3]
    },
    'concat': {
        name: "concat.tmp_2",
        shape: [2, 2, 3]
    }
    ,
    'concat_mul': {
        name: "concat.tmp_3",
        shape: [2, 2, 5]
    }
};

async function run() {
    const runner = new Runner({
        modelPath
    });
    await runner.init();
    runner.genOpData();
    const executeOP = runner.weightMap[0];
    runner.executeOp(executeOP);
    console.log(await gpuInstance.read(OP_INFO_MAP[opName]));
}

const gpuInstance = registerWebGPUBackend();
run();