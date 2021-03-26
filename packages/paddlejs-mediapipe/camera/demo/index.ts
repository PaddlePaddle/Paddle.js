import Camera from '../src/index';

let camera = null;
const loadingDom = document.getElementById('isLoading');
const video = document.getElementById('video') as HTMLVideoElement;
const videoToolDom = document.getElementById('video-tool');
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

// 点击视频控制按钮，实现视频播放/截图/暂停功能
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
    camera = new Camera(video, {
        switchError,
        videoLoaded,
        onNotSupported
    });
}
