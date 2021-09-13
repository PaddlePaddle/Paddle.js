import * as mobilenet from '@paddlejs-models/mobilenet';
import map from './data/map.json';

declare let window: Window & {
    statistic: any
};
window.statistic = {};

load();

async function load() {
    const path = 'https://paddlejs.cdn.bcebos.com/models/mobilenetV2_nchw';
    await mobilenet.load({
        path,
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225]
    }, map);
    document.getElementById('loading')!.style.display = 'none';
}

async function run(input: HTMLElement) {
    window.statistic.startTime = (+new Date());
    const res = await mobilenet.classify(input);
    window.statistic.endTime = (+new Date()) - window.statistic.startTime;
    document.getElementById('txt')!.innerHTML = res;
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
    const initInnerHTML: string = '...';
    document.getElementById('txt')!.innerHTML = initInnerHTML;
    document.getElementById('all-performance-time')!.innerHTML = initInnerHTML;
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
