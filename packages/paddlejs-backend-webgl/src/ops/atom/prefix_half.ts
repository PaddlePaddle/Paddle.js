/**
 * @file prefix code of half float type
 */

import { adapterFunctions } from './common_func_adaptor';

export default function () {
    return `
            #define isnan(value) isnan_custom(value)
            bool isnan_custom(float val) {
                return (val > 0. || val < 1. || val == 0.) ? false : true;
            }

            varying vec2 vCoord;
            varying vec4 outColor;
            void setOutput(float result) {
                result = fuse_op(result);
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

