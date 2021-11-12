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

function drawBox(points: number[]) {
    canvasOutput.width = imgElement.naturalWidth;
    canvasOutput.height = imgElement.naturalHeight;
    const ctx = canvasOutput.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvasOutput.width, canvasOutput.height);
    points && points.forEach(point => {
        // 开始一个新的绘制路径
        ctx.beginPath();
        // 设置线条颜色为蓝色
        ctx.strokeStyle = 'blue';
        // 设置路径起点坐标
        ctx.moveTo(point[0][0], point[0][1]);
        ctx.lineTo(point[1][0], point[1][1]);
        ctx.lineTo(point[2][0], point[2][1]);
        ctx.lineTo(point[3][0], point[3][1]);
        ctx.closePath();
        ctx.stroke();
    });
}

inputElement.addEventListener('change', (e: Event) => {
    imgElement.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
}, false);

imgElement.onload = async function () {
    canvasOutput.width = imgElement.width;
    canvasOutput.height = imgElement.height;
    // 获取文本检测坐标及识别内容
    const res = await ocr.recognition(imgElement);
    drawBox(res.points);
    console.log(res.text);
    let text = '';
    for (let i = 0; i < res.text.length; i++) {
        text += `<p>${res.text[i]}</p>`;
    }
    txt.innerHTML = text;
};
