/**
 * @file humanseg model use gpu unique pipeline
 */


import * as humanseg from '../src/index_gpu';

async function load() {
    await humanseg.load();
    document.getElementById('loading')!.style.display = 'none';
    const img = document.getElementById('image') as HTMLImageElement;
    run(img);
}


const back_canvas = document.getElementById('back') as HTMLCanvasElement;
const blur_canvas = document.getElementById('blur') as HTMLCanvasElement;
const mask_canvas = document.getElementById('mask') as HTMLCanvasElement;

const background_canvas = document.createElement('canvas');
background_canvas.width = back_canvas.width;
background_canvas.height = back_canvas.height;

const img = new Image();
img.src = './bgImgs/001.jpg';
img.onload = () => {
    background_canvas.getContext('2d').drawImage(img, 0, 0, background_canvas.width, background_canvas.height);
};

load();

async function run(input) {
    await humanseg.blurBackground(input, blur_canvas);
    await humanseg.drawHumanSeg(input, back_canvas, background_canvas);
    await humanseg.drawMask(input, mask_canvas, background_canvas);
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

