import { registerBackend } from 'paddlejs-core';
import WebGPUBackend from './gpu';
import { ops } from './ops';

const gpuInstance = new WebGPUBackend();

function registerWebGPUBackend() {
    registerBackend(
        'webgpu',
        gpuInstance,
        ops
    );
    return gpuInstance;
}

export default registerWebGPUBackend;
