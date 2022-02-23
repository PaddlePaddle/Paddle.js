/**
 * @file precision
 */

import { env } from '@paddlejs/paddlejs-core';

export default function genPrecisionCode() {
    return env.get('webglVersion') === 2
        ? ` #version 300 es
            #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
        #else
            precision mediump float;
            precision mediump int;
        #endif      
        `
        : ` #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
        #else
            precision highp float;
            precision highp int;
        #endif
        `;
}
