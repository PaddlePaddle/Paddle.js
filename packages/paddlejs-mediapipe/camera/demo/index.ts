import * as humanseg from '../../../paddlejs-models/humanseg/src/index';
import Camera from '../src/index';

let camera = null;
let TYPE = 'video';
let loadingDom = document.getElementById("isLoading");
let video = document.getElementById('video') as any;
const upload = document.getElementById("uploadImg");
const videoToolDom = document.getElementById('video-tool');
const videoSelect = document.getElementById('videoSelect') as any;
const startBtn = document.getElementById('start') as any;
const endBtn = document.getElementById('end') as any;
const shotBtn = document.getElementById('shot') as any;

(function main() {
    // 采用图片模式
    if (TYPE === 'image') {
        video.remove();
        videoToolDom.remove();
        loadingDom.remove();
        video = null;
    }
    // 采用视频模式
    else if (TYPE === 'video') {
        upload.remove();
    }
})();

load();

if (video) {
    camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video
    });
    /* 获取摄像头并开始视频流 */
    camera.getDevices().then(devices => {
        console.log(devices, 'devices');
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

/* 循环跑模型 */
let loopFlag = true;
async function loop() {
    let input = camera.curVideo;
    if (loopFlag) {
        await run(input);
    }
}

/* 视频开始播放时，开始模型预热 */
video && video.addEventListener('play', async function () {
    startBtn.disabled = false;
    startBtn.innerText = '开始测试';
});

/* 点击开始按钮，开始正式跑模型 */
document.getElementById('tool').addEventListener('click', function(e: any) {
    if (e.target.id === 'start') {
        shotBtn.disabled = false;
        endBtn.disabled = false;
        camera.curVideo.play();
        setTimeout(() => {
            startBtn.disabled = true;
        });
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
    await humanseg.load();
    loadingDom && loadingDom.remove();
    startBtn.disabled = false;
    startBtn.innerText = '开始测试';
}

async function run(input) {
    const {
        data
    } = await humanseg.getGrayValue(input);
    const canvas = document.getElementById('demo') as HTMLCanvasElement;
    humanseg.drawHumanSeg(canvas, data);
}

function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
        const img = document.getElementById('image') as HTMLImageElement;
        img.src = evt.target.result as any;
        img.onload = function () {
            run(img);
        };
    };
    reader.readAsDataURL(file.files[0]);
}

// selectImage
upload && (upload.onchange = function () {
    selectImage(this);
});

