import { Runner, env } from '@paddlejs/paddlejs-core';
import '../../src/index';

async function run() {
    const runner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2/model.json',
        fileCount: 4,
        feedShape: {
            fw: 224,
            fh: 224
        },
        fill: '#fff',
        targetSize: { height: 224, width: 224 }
    });

    window.paddlejs = runner;
    env.set('debug', true);
    window.layerName = 'prob_softmax.tmp_0';
    console.log(await runner.init());
    window.weightMap = runner.weightMap;
}

run();
