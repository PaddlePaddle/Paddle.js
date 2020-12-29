/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerBackend } from 'paddlejs-core';
import WebGLBackend from './backend';
import { ops } from './ops';

const glInstance = new WebGLBackend();

function registerWebGLBackend() {
    registerBackend(
        'webgl',
        glInstance,
        ops
    );
    return glInstance;
}

export default registerWebGLBackend;
