import * as mobilenet from '@paddlejs-models/mobilenet';
import map from './data/map.json';

const img = document.getElementById('image') as HTMLImageElement;
const txt = document.getElementById('txt') as HTMLElement;
const time = document.getElementById('all-performance-time') as HTMLElement;
const uploadImg = document.getElementById('uploadImg') as HTMLInputElement;
const loading = document.getElementById('loading');

let startTime = 0;
let endTime = 0;

load();

async function load() {
    const path = 'https://paddlejs.cdn.bcebos.com/models/mobilenetV2_nchw';
    await mobilenet.load({
        path,
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225]
    }, map);
    loading.style.display = 'none';
}

async function run(input: HTMLElement) {
    startTime = +new Date();
    const res = await mobilenet.classify(input);
    endTime = +new Date() - startTime;
    txt.innerText = res;
    time.innerHTML = '计算时间是' + endTime;
}

// selectImage
uploadImg.onchange = (e: Event) => {
    const reader = new FileReader();
    const initInnerText = '...';
    txt.innerText = initInnerText;
    time.innerText = initInnerText;
    reader.onload = () => {
        img.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
        img.onload = () => {
            run(img);
        };
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
};
