import Worker from './worker';

const img = document.querySelector('#image') as HTMLImageElement;
const resultDom = document.querySelector('#result') as HTMLLIElement;
const uploadDom = document.querySelector('#uploadImg') as HTMLInputElement;

const worker = new (Worker as any)();

registerWorkerListeners();

init();

uploadDom.onchange = (e: Event) => {
    if (!e.target) {
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        img.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
        img.onload = () => {
            createImageBitmap(img, 0, 0, img.naturalWidth, img.naturalHeight)
                .then(imageBitmap => {
                    worker.postMessage({
                        event: 'predict',
                        data: imageBitmap
                    }, [imageBitmap]);
                });
        };
    };
    reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
};

function registerWorkerListeners() {
    worker.addEventListener('message', async msg => {
        const {
            event,
            data
        } = msg.data;
        switch (event) {
            case 'predict':
                resultDom.innerText = data;
                break;
            case 'init':
                createImageBitmap(img, 0, 0, img.naturalWidth, img.naturalHeight)
                    .then(ImageBitmap => {
                        worker.postMessage({
                            event: 'predict',
                            data: ImageBitmap
                        }, [ImageBitmap]);
                    });
                document.getElementById('loading').style.display = 'none';
                break;
            default:
                break;
        }
    });
}

async function init() {
    const onscreen = document.createElement('canvas');
    const offscreen = onscreen.transferControlToOffscreen();
    if (offscreen) {
        worker.postMessage({
            event: 'init',
            data: {
                modelPath: 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2Opt/model.json',
                fill: '#fff',
                feedShape: {
                    fw: 224,
                    fh: 224
                },
                mean: [0.485, 0.456, 0.406],
                std: [0.229, 0.224, 0.225]
            }
        });
    }
}