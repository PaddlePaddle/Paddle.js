/**
 * @file mobilenet model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';

interface ModelConfig {
    path: string;
    fileCount: number;
    mean?: number[];
    std?: number[];
}

interface MobilenetMap {
    [key: string]: string
}

let mobilenetMap = null as any;
let runner = null as Runner;

export async function load(config: ModelConfig, map: string[] | MobilenetMap) {
    mobilenetMap = map;

    const {
        path,
        fileCount,
        mean,
        std
    } = config;

    runner = new Runner({
        modelPath: path,
        fileCount: fileCount || 1,
        feedShape: {
            fw: 224,
            fh: 224
        },
        fill: '#fff',
        targetSize: {
            height: 224,
            width: 224
        },
        mean: mean || [],
        std: std || []
    });
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
    const result = mobilenetMap[`${maxItem}`];
    return result;
}

