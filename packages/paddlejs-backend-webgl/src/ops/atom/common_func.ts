/**
 * @file common functions
 * @author yueshuangyan
 */

import transferFromNHWCtoNCHW from './transferFromNHWCtoNCHW';

const prelu = `
float prelu(float x, float p, float b) {
    float result = x;
    if (x < 0.0) {
        result = x * p;
    }

    return result;
}`;

const relu6 = `
float relu6(float x, float threshold, float b) {
    float result = min(max(0.0, x), threshold);
    return result;
}`;

const leakyRelu = `
float leakyRelu(float x, float p, float b) {
    float result = max(x, x * p);
    return result;
}`;

const scale = `
float scale(float x, float p, float b) {
    float result = p * x + b;
    return result;
}`;

const scaleWidthBias = `
float scaleWidthBias(float x, float p, float b) {
    float result = p * (x + b);
    return result;
}`;

const sigmoid = `
float sigmoid(float x, float y, float z) {
    float result = 1.0 / (1.0 + exp(-x));
    return result;
}`;

const hardSigmoid = `
    float hardSigmoid(float x, float slope, float offset) {
        float result = max(0.0, min(1.0, slope * x + offset));
        return result;
    }
`;

const sqrt = `
    float sqrt(float x, float slope, float offset) {
        return sqrt(x);
    }
`;

const pow_func = `
    float pow_func(float x, float factor, float offset) {
        return pow(x, factor);
    }
`;

const tanh_func = `
float tanh_func(float x, float y, float z) {
    return tanh_calc(x);
}`;

const exp_func = `
float exp_func(float x, float y, float z) {
    float result = exp(x);
    return result;
}`;

const abs_func = `
float abs_func(float x, float y, float z) {
    return abs(x);
}`;

export {
    prelu,
    relu6,
    exp_func,
    leakyRelu,
    scale,
    sigmoid,
    hardSigmoid,
    scaleWidthBias,
    sqrt,
    pow_func,
    tanh_func,
    abs_func,
    transferFromNHWCtoNCHW
};

