import Camera from '@paddlejs-mediapipe/camera';
import * as humanseg from '@paddlejs-models/humanseg';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');


const videoCanvas = document.querySelector('#demo') as HTMLCanvasElement;
const bgElement = document.createElement('div') as HTMLDivElement;
const container = document.querySelector('body');
container.appendChild(bgElement);

function makeBgDom() {
    bgElement.style.width = `${videoCanvas.width}px`;
    bgElement.style.height = `${videoCanvas.height}px`;

    const imgURL = 'http://localhost:8866/bgImgs/bg.jpg';
    bgElement.style.backgroundImage = 'url("' + imgURL + '")';
    bgElement.style.backgroundRepeat = 'no-repeat';
    bgElement.style.backgroundSize = 'cover';
    bgElement.style.backgroundPosition = 'center';
    bgElement.style.marginTop = `${-videoCanvas.height}px`;
}
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

async function load() {
    await humanseg.load();
    camera = new Camera(video, {
        onFrame: async () => {
            const {
                data
            } = await humanseg.getGrayValue(video);
            const canvas1 = document.getElementById('demo') as HTMLCanvasElement;
            humanseg.drawHumanSeg(canvas1, data);
            makeBgDom();
        }
    });
}

