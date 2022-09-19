import { OCRDetection } from '../src/index';

const loading = document.getElementById('isLoading');
const inputElement = document.getElementById('uploadImg');
const imgElement = document.getElementById('image1') as HTMLImageElement;
const canvasOutput = document.getElementById('canvas') as HTMLCanvasElement;


const defaultModelConfig = {modelPath: './ppocr_det_960_js/model.json', 
                                        fill: '#fff',
                                        mean: [0.485, 0.456, 0.406],
                                        std: [0.229, 0.224, 0.225],
                                        bgr: true};

const ocrDetector = new OCRDetection(defaultModelConfig);

load();

async function load() {
    await ocrDetector.init();
    loading.style.display = 'none';
}

inputElement.addEventListener('change', (e: Event) => {
    imgElement.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
}, false);

imgElement.onload = async function () {
    canvasOutput.width = imgElement.width;
    canvasOutput.height = imgElement.height;
    const DetPostConfig = {thresh: 0.3, box_thresh: 0.6, unclip_ratio:2.5};
    // 获取文本检测坐标
    const res = await ocrDetector.detect(imgElement, DetPostConfig);
    drawBox(res);
};

function drawBox(points: number[]) {
    canvasOutput.width = imgElement.naturalWidth;
    canvasOutput.height = imgElement.naturalHeight;
    const ctx = canvasOutput.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvasOutput.width, canvasOutput.height);
    points.forEach(point => {
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
