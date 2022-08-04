/**
 * @file batchnorm
 */

function mainFunc(
    { bias, scale, mean, variance, origin },
    { epsilon }
) {
    // calc the real pos of channel
    const len = origin.length_unformatted_shape;
    const realCPos = 4 - len + 1;
    const posStr = `oPos[${realCPos}]`;
    return `
    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);

        // 归一化数据
        vec4 scale = getPixelsFromTexturePos_scale(
            vec2(float(${posStr}) / float(${scale.width_texture}) + 0.00001, 0.0));
        vec4 bias = getPixelsFromTexturePos_bias(
            vec2(float(${posStr}) / float(${bias.width_texture}) + 0.00001, 0.0));
        vec4 mean = getPixelsFromTexturePos_mean(
            vec2((float(${posStr})) / float(${mean.width_texture}) + 0.00001, 0.0));
        vec4 variance = getPixelsFromTexturePos_variance(
            vec2((float(${posStr})) / float(${variance.width_texture}) + 0.00001,
            0.0)
        );

        float x = (o - mean[0]) / sqrt(variance[0] + ${epsilon});
        float res = scale[0] * x + bias[0];
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        scale: ['getPixelsFromTexturePos'],
        bias: ['getPixelsFromTexturePos'],
        mean: ['getPixelsFromTexturePos'],
        variance: ['getPixelsFromTexturePos']
    }
};
