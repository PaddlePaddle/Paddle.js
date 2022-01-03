import * as humanseg from '@paddlejs-models/humanseg/lib/index_gpu';

const img = document.getElementById('image') as HTMLImageElement;
const uploadImg = document.getElementById('uploadImg') as HTMLInputElement;
const contain = document.getElementsByClassName('contain')[0] as HTMLElement;
const origin_canvas = document.getElementById('origin') as HTMLCanvasElement;
const blur_canvas = document.getElementById('blur') as HTMLCanvasElement;
const blur_contain = document.getElementsByClassName('blur-contain')[0] as HTMLElement;
const blur_rect = contain.getBoundingClientRect().left;
const icon = document.getElementById('icon') as HTMLElement;

// 是否激活拖拽状态
let dragging = false;
// 鼠标按下时相对于选中元素的位移
let icon_left = 0;

async function load() {
    await humanseg.load();
    document.getElementById('loading').style.display = 'none';
    run(img);
}

async function run(input: HTMLImageElement) {
    origin_canvas.width = 800;
    origin_canvas.height = 800 / input.naturalWidth * input.naturalHeight;
    const ctx = origin_canvas.getContext('2d');
    ctx.drawImage(input, 0, 0, origin_canvas.width, origin_canvas.height);
    await humanseg.drawHumanSeg(origin_canvas, blur_canvas);
}

load();

// 监听鼠标按下事件
document.addEventListener('mousedown', e => {
    if (e.target === icon) {
        // 激活拖拽状态
        dragging = true;
        // 鼠标按下时和选中元素的坐标偏移:x坐标
        icon_left = e.clientX - icon.getBoundingClientRect().left;
    }
});

// 监听鼠标放开事件
document.addEventListener('mouseup', () => {
    dragging = false;
});

// 监听鼠标移动事件
document.addEventListener('mousemove', e => {
    if (dragging) {
        let moveX = e.clientX - icon_left - blur_rect;
        // 边界值判断
        if (moveX < -20) {
            moveX = -20;
        }
        if (moveX > 780) {
            moveX = 780;
        }
        icon.style.left = moveX + 'px';
        blur_contain.style.width = moveX + 20 + 'px';
    }
});

uploadImg.onchange = (e: Event) => {
    const reader = new FileReader();
    reader.onload = () => {
        img.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
        img.onload = () => {
            run(img);
        };
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
};
