import Camera from '../src/index';

let camera = null;
let loadingDom = document.getElementById("isLoading");
let video = document.getElementById('video') as any;
const videoToolDom = document.getElementById('video-tool');
const startBtn = document.getElementById('start') as any;
const pauseBtn = document.getElementById('pauseBtn') as any;
const stopBtn = document.getElementById('stopBtn') as any;
const canvas = document.getElementById('demo') as HTMLCanvasElement;

load();

// 视频开始播放，loading消失
video && video.addEventListener('loadeddata', async function () {
    loadingDom && loadingDom.remove();
});

// 点击视频控制按钮，实现视频播放/截图/暂停功能
videoToolDom.addEventListener('click', function(e: any) {
    if (e.target.id === 'start') {
        camera.start();
    }
    if (e.target.id === 'pause') {
        camera.pause();
    }
    if (e.target.id === 'stop') {
        camera.stop();
    }
});

async function load() {
    camera = new Camera(video, {
        onFrame: canvas => {
            console.log(canvas, 'canvas')
        }
    });
}

