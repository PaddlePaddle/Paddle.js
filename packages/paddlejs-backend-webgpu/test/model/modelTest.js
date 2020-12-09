import { Runner } from 'paddlejs-core/src/index';
import registerWebGPUBackend from '../../src/index';

const modelDir = `/test/model/mock/`;
const modelPath = `${modelDir}model.json`;

async function run() {
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 4,
            fh: 2
        }
    });
    await runner.init();
    console.log(runner.weightMap);
    console.log(await runner.preheat());
}

registerWebGPUBackend();
run();