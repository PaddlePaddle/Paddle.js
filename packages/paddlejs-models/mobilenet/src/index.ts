/**
 * @file mobilenet model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
import map from './map.json';

const path = 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2/model.json';
const runner = new Runner({
    modelPath: path,
    fileCount: 4,
    feedShape: {
        fw: 224,
        fh: 224
    },
    fill: '#fff',
    inputType: 'image',
    targetSize: {
        height: 224,
        width: 224
    },
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225]
});

export async function load() {
    await runner.init();
}

// 获取数组中的最大值索引
function getMaxItem(datas: number[] = []) {
    const max: number = Math.max.apply(null, datas);
    const index: number = datas.indexOf(max);
    return index;
}


export async function classify(image) {
    const res = await runner.predict(image);
    const maxItem = getMaxItem(res);
    const result = map[`${maxItem}`];
    return result;
}

