import * as gesture from '../src/index';

const loading = document.getElementById('isLoading');
const content = document.getElementById('txt');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const img = document.getElementById('image') as HTMLImageElement;
const rectDom = document.getElementById('rect');

load();

async function load() {
    await gesture.load();
    loading.style.display = 'none';
}

async function run(input: HTMLElement) {
    const res = await gesture.classify(input);
    let text = '未识别到手';
    if (res.box && res.box.length) {
        text = res.type;
        calculateBox(res.box);
    }
    content.innerText = text;
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
    content.innerText = '识别中...';
    reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === 'string') {
            img.src = evt.target.result;
        }
        img.onload = function () {
            run(img);
        };
    };
    reader.readAsDataURL(file.files[0]);
}

function drawBox(point) {
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
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
}

function calculateBox(box) {
    let offsetX = 0;
    let offsetY = 0;

    if (img.width < img.height) {
        offsetX = img.height - img.width;
    }

    if (img.width > img.height) {
        offsetY = img.width - img.height;
    }

    const height = Math.abs(box[3][1] - box[0][1]);
    const width = Math.abs(box[1][0] - box[0][0]);
    const widthRatio = (img.width + offsetX) / 256;
    const heightRatio = (img.height + offsetY) / 256;
    const point = [];

    box.forEach(item => {
        const tmpPonit = [];
        tmpPonit[0] = item[0] * widthRatio - offsetX / 2;
        tmpPonit[1] = item[1] * heightRatio - offsetY / 2;
        point.push(tmpPonit);
    });

    // canvas 绘制框选位置
    drawBox(point);

    // div展示框选位置
    const transformStr = `translate(${box[0][0] * widthRatio - offsetX / 2}px,
            ${box[0][1] * heightRatio - offsetY / 2}px) scale(${widthRatio * width / 100},
            ${heightRatio * height / 100})
        `;
    const cssObj = rectDom.style;
    cssObj.transform = transformStr;
    cssObj.border = '2px solid red';
}
