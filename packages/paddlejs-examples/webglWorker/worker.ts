import { Runner, env } from '@paddlejs/paddlejs-core';
import { GLHelper } from '@paddlejs/paddlejs-backend-webgl';
import map from './map.json';

const webWorker: Worker = self as any;
const WEBGL_ATTRIBUTES = {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'high-performance'
};

let runner = null;

webWorker.addEventListener('message', async msg => {
    const {
        event,
        data
    } = msg.data;

    switch (event) {
        case 'init':
            await initEvent(data);
            break;
        case 'predict':
            await predictEvent(data);
            break;
        default:
            break;
    }
});


async function initEvent(config) {
    await init(config);
}

async function init(config) {
    const offscreenCanvasFor2D = new OffscreenCanvas(1, 1);
    // 用来作为 core mediaprocessor 里的 canvas getContext('2d')
    env.set('canvas2d', offscreenCanvasFor2D);
    env.set('fetch', (path, params) => {
        return new Promise(function (resolve) {
            fetch(path, {
                method: 'get',
                headers: params
            }).then(response => {
                if (params.type === 'arrayBuffer') {
                    return response.arrayBuffer();
                }
                return response.json();
            }).then(data => resolve(data));
        });
    });
    runner = new Runner(config);
    const offscreenCanvas = new OffscreenCanvas(1, 1);
    const gl = offscreenCanvas.getContext('webgl2', WEBGL_ATTRIBUTES);
    // set gl context
    GLHelper.setWebGLRenderingContext(gl);
    // set gl version
    GLHelper.setWebglVersion(2);
    await runner.init();
    webWorker.postMessage({
        event: 'init'
    });
}

async function predictEvent(imageBitmap: ImageBitmap) {
    const res = await runner.predict(imageBitmap);
    const maxItem = getMaxItem(res);
    webWorker.postMessage({
        event: 'predict',
        data: map[maxItem]
    });
}
// 获取数组中的最大值索引
function getMaxItem(datas: number[] = []) {
    const max: number = Math.max.apply(null, datas);
    const index: number = datas.indexOf(max);
    return index;
}


export default null as any;
