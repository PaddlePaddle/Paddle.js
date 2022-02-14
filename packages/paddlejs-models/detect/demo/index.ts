import * as det from '../src/index';
import label from './label.json';

const loading = document.getElementById('isLoading');
const inputElement = document.getElementById('uploadImg');
const imgElement = document.getElementById('image') as HTMLImageElement;
const canvasOutput = document.getElementById('canvas') as HTMLCanvasElement;

let isPreheat = true;

load();

async function load() {
    await det.init();
    loading.style.display = 'none';
    isPreheat = false;
}

inputElement.addEventListener('change', (e: Event) => {
    imgElement.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
}, false);

imgElement.onload = async () => {
    if (isPreheat) {
        return;
    }
    // 获取检测值
    const res = await det.detect(imgElement);
    const imgHeight = imgElement.height;
    const imgWidth = imgElement.width;
    canvasOutput.width = imgWidth;
    canvasOutput.height = imgHeight;
    const ctx = canvasOutput.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvasOutput.width, canvasOutput.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    res.forEach(item => {
        // 获取检测框选坐标
        const left = Math.floor(item[2] * imgWidth);
        const top = Math.floor(item[3] * imgHeight);
        const right = Math.floor(item[4] * imgWidth);
        const bottom = Math.floor(item[5] * imgHeight);
        ctx.beginPath();
        // 绘制检测框选矩形
        ctx.rect(left, top, right - left, bottom - top);
        // 绘制label
        ctx.fillText(label[item[0]], left + 10, top + 10);
        ctx.stroke();
    });
};
