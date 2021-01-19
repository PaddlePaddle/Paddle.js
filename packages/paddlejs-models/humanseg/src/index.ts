/**
 * @file humanseg model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';

let runner = null as Runner;

export async function load() {
    const path = 'https://paddlejs.cdn.bcebos.com/models/humanseg';

    runner = new Runner({
        modelPath: path,
        fileCount: 1,
        feedShape: {
            fw: 192,
            fh: 192
        },
        fill: '#000',
        targetSize: {
            height: 192,
            width: 192
        },
        mean: [122.675, 116.669, 104.008],
        std: [1.0, 1.0, 1.0],
        scale: 192,
        bgr: true
    });
    await runner.init();
}

export async function seg(image) {
    const res = await runner.predict(image);
    const gray_values = res.slice(192 * 192);
    return gray_values;
}

