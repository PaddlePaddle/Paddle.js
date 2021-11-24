import { Runner } from '@paddlejs/paddlejs-core';
import '../../src';

const modelPathPrefix = '/test/model/mock/';

let runner1;
let runner2;
let runner3;
load();


async function loadRunner1() {
    const w = 5;
    const h = 3;
    runner1 = new Runner({
        modelPath: `${modelPathPrefix}model.json`,
        feedShape: {
            fw: w,
            fh: h
        },
        fill: '#000',
        // center: true,
        mean: [0.815672, 0.917631, 0.964689],
        std: [1, 1, 1],
        needPreheat: true
    });

    await runner1.init();
    return runner1;
}

async function loadRunner2() {
    const w = 5;
    const h = 3;
    runner2 = new Runner({
        modelPath: `${modelPathPrefix}model.json`,
        feedShape: {
            fw: w,
            fh: h
        },
        fill: '#000',
        mean: [0.5, 0.5, 0.5],
        needPreheat: false
    });

    await runner2.init();
    return runner2;
}

async function loadRunner3() {
    const w = 5;
    const h = 3;
    runner3 = new Runner({
        modelPath: `${modelPathPrefix}model.json`,
        feedShape: {
            fw: w,
            fh: h
        },
        fill: '#000',
        needPreheat: false
    });

    await runner3.init();
    return runner3;
}
async function load() {
    const t1 = performance.now();
    return Promise.all([loadRunner1(), loadRunner2(), loadRunner3()]).then(async ([]) => {
        runner2.preheat();
        runner3.preheat();
        const t = performance.now() - t1;
        document.querySelector('#loadTime').innerHTML = t.toString();
        await runner1.predictWithFeed([{ data: new Float32Array(5 * 3 * 3).fill(1.0) }], function (res) {
            console.log(res, 'detect predict');
        });
        await runner2.predictWithFeed([{ data: new Float32Array(5 * 3  * 3).fill(1.0) }], function (res) {
            console.log(res, 'lmk predict');
        });

        await runner3.predictWithFeed([{ data: new Float32Array(5 * 3  * 3).fill(2.0) }], function (res) {
            console.log(res, 'eyes predict');
        });
    });
}

async function run(input?: HTMLElement) {
    console.log(input);
}

// selectImage
document.getElementById('uploadImg')!.onchange = function () {
    selectImage(this);
};


function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
        const img = document.getElementById('image') as HTMLImageElement;
        if (evt.target && typeof evt.target.result === 'string') {
            img.src = evt.target.result;
        }
        img.onload = function () {
            run(img);
        };
    };
    reader.readAsDataURL(file.files[0]);
}