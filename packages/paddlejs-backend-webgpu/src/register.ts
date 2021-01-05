/**
 * @file register backend
 * @author zhangjingyuan
 */

import { registerBackend } from '@paddlejs/paddlejs-core';
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

registerWebGPUBackend();

export default gpuInstance;
