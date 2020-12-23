import { registerOp, registerBackend } from 'paddlejs-core/src/index';
import WebGPUBackend from './gpu';
import { ops } from './ops';

const gpuInstance = new WebGPUBackend();

function registerWebGPUBackend() {
    registerBackend(
        'webgpu',
        gpuInstance
    );
    Object.keys(ops).forEach(key => {
        registerOp(ops[key], key);
    });
    return gpuInstance;
}

export default registerWebGPUBackend;
