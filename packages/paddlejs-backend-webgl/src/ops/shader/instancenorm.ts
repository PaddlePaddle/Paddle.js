/**
 * @file batchnorm
 */

function mainFunc(
    { bias, scale },
    { }
) {
    return `

    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);

        // 归一化数据
        vec4 scale = getPixelsFromTexturePos_scale(vec2(float(oPos.g) / float(${scale.width_texture}) + 0.00001, 0.0));
        vec4 bias = getPixelsFromTexturePos_bias(vec2(float(oPos.g) / float(${bias.width_texture}) + 0.00001, 0.0));
        float mean = getValueFromTensorPos_mean(0, 0, oPos.r, oPos.g);
        float variance = getValueFromTensorPos_variance(0, 0, oPos.r, oPos.g);

        float res = (o - mean) * variance;
        // setOutput(res);

        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'epsilon'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        scale: ['getPixelsFromTexturePos'],
        bias: ['getPixelsFromTexturePos'],
        mean: ['getValueFromTensorPos'],
        variance: ['getValueFromTensorPos']
    }
};
