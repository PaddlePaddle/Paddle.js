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
            const {
                data
            } = await humanseg.getGrayValue(videoCanvas);
            humanseg.blurBackground(data, canvas1);
        }
    });
}
