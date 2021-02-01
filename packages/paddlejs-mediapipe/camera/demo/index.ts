import Camera from '../src/index';

let camera = null;
let loadingDom = document.getElementById("isLoading");
let video = document.getElementById('video') as any;
const videoToolDom = document.getElementById('video-tool');
const videoSelect = document.getElementById('videoSelect') as any;
const startBtn = document.getElementById('start') as any;
const endBtn = document.getElementById('end') as any;
const shotBtn = document.getElementById('shot') as any;
const canvas = document.getElementById('demo') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

load();

/* canvas循环绘制 */
let loopFlag = true;
async function loop() {
    let input = camera.curVideo;
    if (loopFlag) {
        await run(input);
    }
}

// 视频开始播放，loading消失
video && video.addEventListener('loadeddata', async function () {
    startBtn.disabled = false;
    startBtn.innerText = '开始测试';
    loadingDom && loadingDom.remove();
});

// 点击视频控制按钮，实现视频播放/截图/暂停功能
videoToolDom.addEventListener('click', function(e: any) {
    if (e.target.id === 'start') {
        camera.curVideo.play();
        shotBtn.disabled = false;
        endBtn.disabled = false;
        startBtn.disabled = true;
    }
    if (e.target.id === 'shot') {
        loopFlag = true;
        loop();
    }
    if (e.target.id === 'end') {
        loopFlag = false;
        shotBtn.disabled = true;
        endBtn.disabled = true;
        startBtn.disabled = false;
        camera.curVideo.pause();
    }
});

async function load() {
    camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video
    });
    /* 获取摄像头并开始视频流 */
    await camera.getDevices().then(devices => {
        if (devices.length) {
            camera.run(devices[0].deviceId);
            devices.forEach((element, index) => {
                let option = document.createElement('option');
                option.value = element.deviceId;
                option.text = (index + 1);
                videoSelect.appendChild(option);
            });
            videoSelect.onchange = () => {
                camera.run(videoSelect.value);
            };
        }
        else {
            camera.run();
        }
    }).catch(e => {
        console.log(e);
    });
}

async function run(input) {
    // canvas绘制video当前帧
    canvas.width = input.width;
    canvas.height = input.height;
    ctx.drawImage(input, 0, 0, input.width, input.height);
}

