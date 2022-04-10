import { FaceDetector, createImage } from '@paddlejs-models/facedetect';

const resCanvas = document.getElementById('resCanvas') as HTMLCanvasElement;
const resCtx = resCanvas.getContext('2d') as CanvasRenderingContext2D;
const defaultImgPath = './img/multi_small_face.jpeg';
const fileReader = new FileReader();
const loading = document.getElementById('loading');
const faceDetector = new FaceDetector();
let faceDecoration = null as HTMLImageElement;

load();
document.getElementById('uploadImg')!.onchange = function () {
    loadFile(this);
};

async function load() {
    await faceDetector.init();
    faceDecoration = await createImage('./img/facedecoration.png');
    run(defaultImgPath);
}

async function run(imgPath: string) {
    loading.style.display = 'block';
    const imgEle = await createImage(imgPath);
    drawImage(imgEle);
    // 预测
    const res = await faceDetector.detect(imgEle, { shrink: 0.4 });
    drawDecoration(res);
    loading.style.display = 'none';
}

// 绘图
function drawImage(img: HTMLImageElement) {
    const { naturalWidth, naturalHeight } = img;
    resCanvas.width = naturalWidth;
    resCanvas.height = naturalHeight;
    resCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
}

// 绘制头像框
function drawDecoration(data) {
    // 按照人脸框面积排序 近大远小
    data.sort((item1, item2) => {
        return item1.width * item1.height - item2.width * item2.height;
    });

    data.forEach(item => {
        resCtx.lineWidth = 4;
        // 人脸框位置
        const x = item.left * resCanvas.width;
        const y = item.top * resCanvas.height;
        const w = item.width * resCanvas.width;
        const h = item.height * resCanvas.height;

        // 人脸装饰位置
        const ratio = 1.7;
        const decW = ratio * w;
        const decH = ratio * h;
        const decY = y - (decH - h) / 2;
        const decX = x - (decW - w) / 2;
        resCtx.drawImage(faceDecoration, decX, decY, decW, decH);
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
