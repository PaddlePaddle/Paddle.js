/* eslint-disable */
/**
 * @file batchnorm主函数
 * @author wangqun
 */
export default `
// start函数
void main(void) {
    // 输出数据
    ivec4 oPos = getOutputTensorPosLIMIT_OUT();
    float o = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, oPos.b, oPos.a);

    // 归一化数据
    vec4 scale = getPixelsFromTexturePos_texture_scale(vec2( float(oPos.g) / float(width_texture_scale) + 0.00001, 0.0));
    vec4 bias = getPixelsFromTexturePos_texture_bias(vec2( float(oPos.g) / float(width_texture_bias) + 0.00001, 0.0));
    vec4 mean = getPixelsFromTexturePos_texture_mean(vec2((float(oPos.g)) / float(width_texture_mean)  + 0.00001, 0.0));
    vec4 variance = getPixelsFromTexturePos_texture_variance(vec2((float(oPos.g)) / float(width_texture_variance)  + 0.00001, 0.0));

    float x = (o - mean[0]) / sqrt(variance[0] + epsilon);
    float res = scale[0] * x + bias[0];
    setOutput(res);
}
`;
