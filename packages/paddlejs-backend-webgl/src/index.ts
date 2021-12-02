/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerBackend } from '@paddlejs/paddlejs-core';
import WebGLBackend from './backend';
import { ops } from './ops';
import { GLHelper } from './webgl/WebGLUtils';
import * as webgl_types from './webgl/webgl_types';

const glInstance = new WebGLBackend();

function registerWebGLBackend() {
    registerBackend(
        'webgl',
        glInstance,
        ops
    );
    return glInstance;
}

registerWebGLBackend();

export {
    glInstance,
    GLHelper,
    webgl_types,
    ops
};
