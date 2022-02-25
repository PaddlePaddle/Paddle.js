import * as mobilenet from '../src/index';
import map from './map.json';

load();

async function load() {
    const path = 'https://paddlejs.bj.bcebos.com/models/fuse/mobilenet/mobileNetV2_fuse_activation/model.json';
    await mobilenet.load({
        path,
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225]
    }, map);
    document.getElementById('loading')!.style.display = 'none';
    const img = document.getElementById('image') as HTMLImageElement;
    run(img);
}

async function run(input?: HTMLElement) {
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
