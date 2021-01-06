import * as mobilenet from '../lib';

// 统计参数
let loaded = false;
async function run(input: HTMLElement) {
    if (!loaded) {
        await mobilenet.load();
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