import { Runner } from '../../../paddlejs-core/src/index';
import backend from '../../src/index';

const path = require('path');

const opName = 'elementwise_add';
const modelDir = path.resolve(__dirname, './data');
const modelPath = `${modelDir}/${opName}.json`;

async function run() {
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 3,
            fh: 3
        },
        needPreheat: false
    });
    await runner.init();
    const executeOP = runner.weightMap[0];
    runner.executeOp(executeOP);
    console.log(await backend.read());
}

run();
