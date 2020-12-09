import { Runner } from 'paddlejs-core/src/index';
import registerWebGPUBackend from '../../src/index';

const opName = 'conv2d';
const modelDir = `/test/op/data/`;
const modelPath = `${modelDir}${opName}.json`;

async function run() {
    const runner = new Runner({
        modelPath
    });
    await runner.init();
    const executeOP = runner.weightMap[0];
    runner.executeOp(executeOP);
    console.log(await gpuInstance.read(executeOP));
}

const gpuInstance = registerWebGPUBackend();
run();