/* eslint-disable */
/**
 * @file batchnorm主函数
 * @author wangqun
 */
export default `
// start函数
void main(void) {
    // 输出数据
<<<<<<< HEAD
    ivec4 oPos = getOutputTensorPosLIMIT_OUT();
    float o = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, oPos.b, oPos.a);

    // 归一化数据
    vec4 scale = getPixelsFromTexturePos_texture_scale(vec2((float(oPos.g) + 0.5) / float(width_texture_scale), 0.0));
    vec4 bias = getPixelsFromTexturePos_texture_bias(vec2((float(oPos.g) + 0.5) / float(width_texture_bias), 0.0));
    vec4 mean = getPixelsFromTexturePos_texture_mean(vec2((float(oPos.g) + 0.5) / float(width_texture_mean), 0.0));
    vec4 variance = getPixelsFromTexturePos_texture_variance(vec2((float(oPos.g) + 0.5) / float(width_texture_variance), 0.0));
=======
    ivec4 oPos = getOutputTensorPos();
    float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);

    // 归一化数据
    vec4 scale = getPixelsFromTexturePos_texture_scale(vec2( float(oPos.g) / float(width_texture_scale), 0.0));
    vec4 bias = getPixelsFromTexturePos_texture_bias(vec2((float(oPos.g)) / float(width_texture_bias), 0.0));
    vec4 mean = getPixelsFromTexturePos_texture_mean(vec2((float(oPos.g)) / float(width_texture_mean), 0.0));
    vec4 variance = getPixelsFromTexturePos_texture_variance(vec2((float(oPos.g)) / float(width_texture_variance), 0.0));
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee

    float x = (o - mean[0]) / sqrt(variance[0] + epsilon);
    float res = scale[0] * x + bias[0];
    setOutput(res);
}
`;
