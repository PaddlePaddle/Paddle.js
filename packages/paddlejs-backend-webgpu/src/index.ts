import WebGPUBackend from './gpu';
import { ops } from './ops';

const gpuInstance = new WebGPUBackend();
function createWebGPUBackend(registerBackend: Function) {
    registerBackend(
        'webgpu',
        gpuInstance,
        ops
    );
    return gpuInstance;
}

export default createWebGPUBackend;
