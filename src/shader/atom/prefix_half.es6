/* eslint-disable */
/**
 * @file 预设条件
 * @author yangmingming
 */
export default `
#ifdef GL_FRAGMENT_PRECISION_HIGH
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
`;

