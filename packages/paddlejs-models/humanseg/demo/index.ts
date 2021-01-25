import * as humanseg from '../src/index';



async function load() {
    await humanseg.load();
}

load();

async function run(input) {
    const {
        data
    } = await humanseg.getGrayValue(input);

    const canvas1 = document.getElementById('demo1') as HTMLCanvasElement;
    humanseg.drawHumanSeg(canvas1, data);
    const canvas2 = document.getElementById('demo2') as HTMLCanvasElement;
    humanseg.drawMask(canvas2, data, true);
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

