import * as ocr from '@paddlejs-models/ocr';

const $uploadImg = document.getElementById('uploadImg') as HTMLInputElement;
const $img = document.getElementById('image') as HTMLImageElement;
const $txt = document.getElementById('txt');

async function load() {
    await ocr.init();
    document.getElementById('isLoading').style.display = 'none';
}

async function run(input: HTMLImageElement) {
    const $canvas = document.getElementById('canvas');
    const res = await ocr.recognize(input, { canvas: $canvas });
    if (res.text?.length) {
        // 页面展示识别内容
        $txt.innerHTML = res.text.reduce((total, cur) => total + `<p>${cur}</p>`);
    }
}

load();

$uploadImg.onchange = (e: Event) => {
    const reader = new FileReader();
    reader.onload = () => {
        $img.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
        $img.onload = () => {
            run($img);
        };
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
};
