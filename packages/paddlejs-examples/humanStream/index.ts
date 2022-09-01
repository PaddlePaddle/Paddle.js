import Camera from '@paddlejs-mediapipe/camera';
import * as humanseg from '@paddlejs-models/humanseg/lib/index_gpu';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');

const bgElement = document.createElement('div') as HTMLDivElement;
const container = document.querySelector('body');


const back_canvas = document.getElementById('back') as HTMLCanvasElement;
const background_canvas = document.createElement('canvas');
background_canvas.width = back_canvas.width;
background_canvas.height = back_canvas.height;

const img = new Image();
img.src = './bgImgs/bg.jpg';
img.onload = () => {
    background_canvas.getContext('2d').drawImage(img, 0, 0, background_canvas.width, background_canvas.height);
};

container.appendChild(bgElement);

load();

// 视频开始播放，loading消失
video && video.addEventListener('loadeddata', async function () {
    loadingDom && loadingDom.remove();
});

// 点击视频控制按钮，实现视频播放/截图/暂停功能
videoToolDom.addEventListener('click', function (e: Event) {
    const target = e.target as HTMLElement;
    if (target.id === 'start') {
        camera.start();
    }
    if (target.id === 'pause') {
        camera.pause();
    }
});

const canvas1 = document.getElementById('demo') as HTMLCanvasElement;


const videoCanvas = document.createElement('canvas') as HTMLCanvasElement;
const videoCanvasCtx = videoCanvas.getContext('2d');
async function load() {
    await humanseg.load();
    camera = new Camera(video, {
        mirror: true,
        enableOnInactiveState: true,
        onFrame: async () => {
            videoCanvas.width = video.width;
            videoCanvas.height = video.height;
            videoCanvasCtx.drawImage(video, 0, 0, video.width, video.height);
            humanseg.drawHumanSeg(videoCanvas, canvas1, background_canvas);
        }
    });
}
