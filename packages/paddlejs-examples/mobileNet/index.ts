import { Runner } from '@paddlejs/paddlejs-core';
import registerWebGLBackend from '@paddlejs/paddlejs-backend-webgl';
import map from './data/map.json';
// Register the WebGL backend to the global backend registry before initializing runner
registerWebGLBackend();

declare let window: Window & {
    statistic: any
};
window.statistic = [];

async function run(input: HTMLElement) {
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
    window.statistic.startTime = (+new Date());
    await runner.init();
    const res = await runner.predict(input);
    window.statistic.endTime = (+new Date()) - window.statistic.startTime;
    const maxItem = getMaxItem(res);
    document.getElementById('txt')!.innerHTML = map['' + maxItem.index];
    document.getElementById('all-performance-time')!.innerHTML = '计算时间是' + window.statistic.endTime;
}

// selectImage
document.getElementById('uploadImg')!.onchange = function () {
    selectImage(this);
};

function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
        const img = document.getElementById('image') as HTMLImageElement;
        if (evt.target && typeof evt.target.result === 'string') {
            img.src = evt.target.result;
        }
        img.onload = function () {
            run(img);
        };
    };
    reader.readAsDataURL(file.files[0]);
}

// 获取数组中的最大值和索引
function getMaxItem(datas: number[] = []) {
    const max: number = Math.max.apply(null, datas);
    const index: number = datas.indexOf(max);
    return { value: max, index };
}
