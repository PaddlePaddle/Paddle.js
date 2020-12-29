/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerOp, registerBackend } from 'paddlejs-core/src/index';
import WebGLBackend from './backend';
import { ops } from './ops';

const glInstance = new WebGLBackend();

function registerWebGLBackend() {
    registerBackend(
        'webgl',
        glInstance
    );
    Object.keys(ops).forEach(key => {
        registerOp(ops[key], key);
    });
    return glInstance;
}

export default registerWebGLBackend;
