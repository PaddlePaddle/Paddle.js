import * as humanseg from '../src';

async function load() {
    await humanseg.load();
    document.getElementById('loading')!.style.display = 'none';
}

load();
const back_canvas = document.getElementById('back') as HTMLCanvasElement;
const blur_canvas = document.getElementById('blur') as HTMLCanvasElement;
const mask_canvas = document.getElementById('mask') as HTMLCanvasElement;
const img = new Image();
img.src = './bgImgs/bg.jpg';
img.onload = () => {
    back_canvas.getContext('2d').drawImage(img, 0, 0, back_canvas.width, back_canvas.height);
};

async function run(input) {
    const {
        data
    } = await humanseg.getGrayValue(input);

    humanseg.blurBackground(data, blur_canvas);
    humanseg.drawHumanSeg(data, back_canvas);
    humanseg.drawMask(data, mask_canvas, true);
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
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};

