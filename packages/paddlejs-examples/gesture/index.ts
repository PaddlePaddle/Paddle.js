import * as gesture from '@paddlejs-models/gesture';

const $uploadImg = document.getElementById('uploadImg') as HTMLInputElement;
const $img = document.getElementById('image') as HTMLImageElement;
const $txt = document.getElementById('txt');

async function load() {
    await gesture.load();
    document.getElementById('isLoading').style.display = 'none';
}

async function run(input: HTMLImageElement) {
    const res = await gesture.classify(input);
    let text = '未识别到手';
    if (res.box && res.box.length) {
        text = res.type;
        calculateBox(input, res.box);
    }
    $txt.innerText = text;
}

function calculateBox(img, box) {
    let offsetX = 0;
    let offsetY = 0;

    if (img.width < img.height) {
        offsetX = img.height - img.width;
    }

    if (img.width > img.height) {
        offsetY = img.width - img.height;
    }

    const $canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const widthRatio = (img.width + offsetX) / 256;
    const heightRatio = (img.height + offsetY) / 256;
    const point = [];

    box.forEach(item => {
        const tmpPonit = [];
        tmpPonit[0] = item[0] * widthRatio - offsetX / 2;
        tmpPonit[1] = item[1] * heightRatio - offsetY / 2;
        point.push(tmpPonit);
    });
    $canvas.width = img.width;
    $canvas.height = img.height;
    const ctx = $canvas.getContext('2d');
    // 开始一个新的绘制路径
    ctx.beginPath();
    ctx.drawImage(img, 0, 0, $canvas.width, $canvas.height);
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
