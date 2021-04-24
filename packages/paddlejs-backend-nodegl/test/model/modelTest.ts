import { Runner } from '../../../paddlejs-core/src/index';
import '../../src/index';

const path = require('path');

const modelDir = path.resolve(__dirname, './mock');
const modelPath = `${modelDir}/model.json`;

async function run() {
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 5,
            fh: 3
        }
    });
    const preheatRes = await runner.init();
    console.log(preheatRes); // [ 30, 25, 40, 30, 25, 40 ]
}

run();