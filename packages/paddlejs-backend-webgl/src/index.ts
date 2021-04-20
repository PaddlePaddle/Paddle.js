/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerBackend } from '@paddlejs/paddlejs-core';
import WebGLBackend from './backend';
import { ops } from './ops';
import { GLHelper } from './webgl/WebGLUtils';
import * as webgl_types from './webgl/webgl_types';
import { GLOBALS } from '@paddlejs/paddlejs-core/globals';

let glInstance;
function registerWebGLBackend(name?: string) {
    glInstance = new WebGLBackend();
    registerBackend(
        name || 'webgl',
        glInstance,
        ops,
        'webgl'
    );
    return glInstance;
}

registerWebGLBackend();
GLOBALS.registerTypedBackend = registerWebGLBackend;

export {
    glInstance,
    GLHelper,
    webgl_types
};
