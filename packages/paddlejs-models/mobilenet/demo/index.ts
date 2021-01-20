import * as mobilenet from '../src/index';
import map from './map.json';

let loaded = false;
const path = 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2Opt';
async function run(input?: HTMLElement) {
    if (!loaded) {
        await mobilenet.load({
            path,
            fileCount: 4,
            mean: [0.485, 0.456, 0.406],
            std: [0.229, 0.224, 0.225]
        }, map);
        loaded = true;
    }
    const res = await mobilenet.classify(input);
    document.getElementById('txt')!.innerHTML = res;
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