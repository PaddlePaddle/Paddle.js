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
    float result = max(0.0,x);
    result = min(result,threshold);
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

export {
    prelu,
    relu6,
    leakyRelu,
    scale,
    sigmoid,
    hardSigmoid,
    transferFromNHWCtoNCHW
};

