import { Runner } from '@paddlejs/paddlejs-core';
import backend from '../../src/index';

const opName = 'arg_max';
const modelDir = '/test/op/data/';
const modelPath = `${modelDir}${opName}.json`;


async function run() {
    const runner = new Runner({
        modelPath,
        fileCount: 0,
        feedShape: {
            fw: 3,
            fh: 3
        },
        needPreheat: false
    });
    await runner.init();
    const executeOP = runner.weightMap[0];
    console.log(runner.weightMap);
    runner.executeOp(executeOP);
    console.log(await backend.read());
}

run();
