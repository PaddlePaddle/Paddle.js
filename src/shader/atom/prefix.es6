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
    varying vec2 vCoord;
    varying vec4 outColor;
    void setOutput(float result) {
            gl_FragColor.r = result;
    }
`;

