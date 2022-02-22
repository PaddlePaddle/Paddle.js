/**
 * @file prefix code of half float type
 */

import { adapterFunctions } from './common_func_adaptor';

export default function () {
    return ` #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
        #else
            precision highp float;
            precision highp int;
        #endif

            #define isnan(value) isnan_custom(value)
            bool isnan_custom(float val) {
                return (val > 0. || val < 1. || val == 0.) ? false : true;
            }

            varying vec2 vCoord;
            varying vec4 outColor;
            void setOutput(float result) {
                if(isnan(result)) {
                    gl_FragColor.r = 0.0;
                }else {
                    gl_FragColor.r = result;
                }
            }

            void setPackedOutput(vec4 result) {
                gl_FragColor = result;
            }

            ${adapterFunctions()}

            int calCeil(int a, int b) {
                return int(ceil(float(a) / float(b)));
            }
        `;
}

