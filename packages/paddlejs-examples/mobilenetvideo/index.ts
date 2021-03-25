import * as mobilenet from '@paddlejs-models/mobilenet';
import Camera from '@paddlejs-mediapipe/camera';
import map from './data/map.json';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');
const text = document.getElementById('text');
const switchDom = document.getElementById('switch') as HTMLButtonElement;

const switchError = () => {
    switchDom.disabled = true;
};

const videoLoaded = () => {
    loadingDom && loadingDom.remove();
    camera && camera.start();
};

const onNotSupported = () => {
    loadingDom && loadingDom.remove();
    alert('浏览器不支持webrtc');
};

load();

// 点击视频控制按钮，实现视频播放/暂停/切换摄像头功能
videoToolDom.addEventListener('click', function (e: Event) {
    if (!camera) {
        return;
    }
    const target = e.target as HTMLElement;
    if (target.id === 'start') {
        camera.start();
    }
    if (target.id === 'pause') {
        camera.pause();
    }
    if (target.id === 'switch') {
        camera.switchCameras();
    }
});

async function load() {
    await mobilenet.load({
        path: 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2',
        fileCount: 4,
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225]
    }, map);
    camera = new Camera(video, {
        onFrame: async () => {
            const res = await mobilenet.classify(video);
            text.innerHTML = res;
        },
        switchError,
        videoLoaded,
        onNotSupported
    });
}
