import Camera from '@paddlejs-mediapipe/camera';
import * as humanseg from '@paddlejs-models/humanseg';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');

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
    if (target.id === 'stop') {
        camera.stop();
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
        }
    });
    console.log(camera);
}

