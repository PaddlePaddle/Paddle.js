import { Runner } from 'paddlejs-core/src/index';
import registerWebGLBackend from '../../src/index';

async function run() {
    const runner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/tinyYolo/model.json',
        fileCount: 1,
        feedShape: {
            fw: 320,
            fh: 320
        },
        fetchShape: [1, 25, 10, 10],
        fill: '#000',
        scale: 192,
        targetSize: { height: 320, width: 320 },
        mean: [117.001 / 255, 114.697 / 255, 97.404 / 255],
        std: [1.0, 1.0, 1.0]
    });
    await runner.init();
    console.log(await runner.preheat());
}

registerWebGLBackend();
run();
