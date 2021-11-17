import * as ocr from '../src/index';

const loading = document.getElementById('isLoading');
const txt = document.getElementById('txt');
const inputElement = document.getElementById('uploadImg');
const imgElement = document.getElementById('image') as HTMLImageElement;
const canvasOutput = document.getElementById('canvas') as HTMLCanvasElement;

load();

async function load() {
    await ocr.load();
    loading.style.display = 'none';
}

inputElement.addEventListener('change', (e: Event) => {
    imgElement.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
}, false);

imgElement.onload = async () => {
    txt.innerHTML = '';
    // 绘制文本框选坐标
    await ocr.drawBox(imgElement, canvasOutput);
    // 获取文本检测坐标及识别内容
    const res = await ocr.recognize(imgElement);
    if (res.text?.length) {
        // 页面展示识别内容
        txt.innerHTML = res.text.reduce((total, cur) => total + `<p>${cur}</p>`);
    }
};
