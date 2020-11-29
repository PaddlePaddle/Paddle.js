import { Runner } from '../../paddlejs-core/src/index';
import registerWebGPUBackend from '../src/index';

const opName = 'mul';
const modelDir = `/test/data/`;
const modelPath = `${modelDir}${opName}.json`;

async function run() {
    const runner = new Runner({
        modelPath,
        fetchShape: [2, 3]
    });
    await runner.init();
    const executeOP = runner.weightMap[0];
    runner.executeOp(executeOP);
    console.log(await gpuInstance.read(executeOP));
}

const gpuInstance = registerWebGPUBackend();
run();