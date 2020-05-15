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
<<<<<<< HEAD
    precision highp float;
    precision highp int;
#endif
    varying vec2 vCoord;
    varying vec4 outColor;
    void setOutput(float result) {
            gl_FragColor.r = result;
    }
`;

=======
    precision mediump float;
    precision mediump int;
#endif

    void setOutput(float result) {
        gl_FragColor.r = result;
    }
`;
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
