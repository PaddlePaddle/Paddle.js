/**
 * @file prefix code
 */

import { env } from '@paddlejs/paddlejs-core';
import prefix_uint from './prefix_uint';
import prefix_half from './prefix_half';
import { adapterFunctions } from './common_func_adaptor';

function prefixV1() {
    return ` #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
        #else
            precision highp float;
            precision highp int;
        #endif
            varying vec2 vCoord;
            varying vec4 outColor;
            void setOutput(float result) {
                gl_FragColor.r = result;
            }
            void setPackedOutput(vec4 result) {
                gl_FragColor = result;
            }
            int calCeil(int a, int b) {
                return int(ceil(float(a) / float(b)));
            }
            ${adapterFunctions()}
    `;
}
function prefixV2() {
    return ` #version 300 es
        #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
        #else
            precision mediump float;
            precision mediump int;
        #endif

        // 顶点shader透传的材质坐标
        in vec2 vCoord;
        out vec4 outColor;
        void setOutput(float result) {
            outColor.r = result;
        }
        void setPackedOutput(vec4 result) {
            outColor = result;
        }
        int calCeil(int a, int b) {
            return int(ceil(float(a) / float(b)));
        }
        ${adapterFunctions()}
    `;
}

export default function genPrefixCode({ frameBufferSupportFloat, isFinalOp, isFloatTextureReadPixelsEnabled }) {
    return env.get('webglVersion') === 2
        ? prefixV2()
        : frameBufferSupportFloat
            ? prefixV1()
            : isFinalOp && !isFloatTextureReadPixelsEnabled
                ? prefix_uint()
                : prefix_half();

}
