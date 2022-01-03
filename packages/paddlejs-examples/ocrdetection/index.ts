import * as ocr from '@paddlejs-models/ocrdet';

const $uploadImg = document.getElementById('uploadImg') as HTMLInputElement;
const $img = document.getElementById('image') as HTMLImageElement;

async function load() {
    await ocr.load();
    document.getElementById('isLoading').style.display = 'none';
}

async function run(input: HTMLImageElement) {
    const res = await ocr.detect(input);
    const $canvas = document.getElementById('canvas') as HTMLCanvasElement;
    $canvas.width = input.naturalWidth;
    $canvas.height = input.naturalHeight;
    const ctx = $canvas.getContext('2d');
    ctx.drawImage(input, 0, 0, $canvas.width, $canvas.height);
    res && res.forEach(point => {
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
