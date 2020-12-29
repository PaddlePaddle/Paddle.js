import { Runner } from 'paddlejs-core/src/index';
import registerWebGLBackend from '../../src/index';

async function run() {
    const runner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/wine/model.json',
        fileCount: 3,
        feedShape: {
            fw: 224,
            fh: 224
        },
        fetchShape: [1, 40, 1, 1],
        fill: '#000',
        scale: 256,
        targetSize: { height: 224, width: 224 },
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225]
    });
    await runner.init();
    console.log(await runner.preheat());
}

registerWebGLBackend();
run();
