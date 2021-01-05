import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgpu';

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
    const preheatRes = await runner.init();
    console.log(preheatRes);
}

run();
