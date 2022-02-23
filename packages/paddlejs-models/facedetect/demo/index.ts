import { FaceDetector, createImage } from '../src/index';

const resCanvas = document.getElementById('resCanvas') as HTMLCanvasElement;
const resCtx = resCanvas.getContext('2d') as CanvasRenderingContext2D;
const defaultImgPath = '../img/multi_small_face.jpeg';
const fileReader = new FileReader();
const loading = document.getElementById('loading');
const faceDetector = new FaceDetector();

load();
document.getElementById('uploadImg')!.onchange = function () {
    loadFile(this);
};

async function load() {
    await faceDetector.init();
    run(defaultImgPath);
}

async function run(imgPath: string) {
    loading.style.display = 'block';
    const imgEle = await createImage(imgPath);
    drawImage(imgEle);
    // 预测
    const res = await faceDetector.detect(imgEle);
    drawRes(res);
    loading.style.display = 'none';
}

// 绘图
function drawImage(img: HTMLImageElement) {
    const { naturalWidth, naturalHeight } = img;
    resCanvas.width = naturalWidth;
    resCanvas.height = naturalHeight;
    resCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
}

// 标记结果
function drawRes(data) {
    resCtx.fillStyle = resCtx.strokeStyle = 'green';
    resCtx.font = '20px';
    resCtx.lineWidth = 2;
    data.forEach(item => {
        const x = item.left * resCanvas.width;
        const y = item.top * resCanvas.height;
        const w = item.width * resCanvas.width;
        const h = item.height * resCanvas.height;
        resCtx.strokeRect(x, y, w, h);
        resCtx.fillText(item.confidence.toFixed(6), x, y);
    });
}

function loadFile(ipt) {
    if (!ipt.files || !ipt.files[0]) {
        return;
    }
    fileReader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === 'string') {
            run(evt.target.result);
        }
    };
    fileReader.readAsDataURL(ipt.files[0]);
}