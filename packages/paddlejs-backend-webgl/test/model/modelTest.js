import { Runner, env } from '@paddlejs/paddlejs-core';
import '../../src/index';

const modelDir = '/test/model/mock/';
const modelPath = `${modelDir}model.json`;

async function run() {
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 5,
            fh: 3
        },
        fileCount: 0
    });

    env.set('debug', true);
    const preheatRes = await runner.init();
    console.log(preheatRes);
    window.weightMap = runner.weightMap;
}

run();
