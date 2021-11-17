/**
 * @file prefix code of uint type
 */

export default `
precision highp float;
precision highp int;

varying vec2 vCoord;
varying vec4 outColor;

const float FLOAT_MAX = 1.70141184e38;
const float FLOAT_MIN = 1.17549435e-38;

#define isnan(value) isnan_custom(value)
bool isnan_custom(float val) {
    return (val > 0. || val < 1. || val == 0.) ? false : true;
}

int calMod(int a, int b) {
    return a - a / b * b;
}

lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
}

void setOutput(float result) {
        gl_FragColor = encode_float(result);
}
`;

