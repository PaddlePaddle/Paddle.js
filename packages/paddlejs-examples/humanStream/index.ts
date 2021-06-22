import Camera from '@paddlejs-mediapipe/camera';
import * as humanseg from '@paddlejs-models/humanseg';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');

const bgElement = document.createElement('div') as HTMLDivElement;
const container = document.querySelector('body');
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

const ctx = canvas1.getContext('2d');
const img = new Image();
img.src = './bgImgs/bg.jpg';
img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas1.width, canvas1.height);
};

async function load() {
    await humanseg.load();
    camera = new Camera(video, {
        onFrame: async () => {
            const {
                data
            } = await humanseg.getGrayValue(video);
            humanseg.drawHumanSeg(canvas1, data);
        }
        // canvas大小不合适可以自行修改width，height
        // width: 800,
        // height: 600
    });
}

