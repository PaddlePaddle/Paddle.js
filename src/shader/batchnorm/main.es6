/* eslint-disable */
/**
 * @file batchnorm主函数
 * @author wangqun
 */
export default `
// start函数
void main(void) {
    // 输出数据
    ivec4 oPos = getOutputTensorPos();

    // 重排遍历顺序
	int sumVal = oPos.g + oPos.a * channel_origin + oPos.b * channel_origin * width_shape_origin;
	int new_a = sumVal % width_shape_origin;
	int new_b = int((sumVal - new_a) / width_shape_origin) % height_shape_origin;
	int new_g = int((((sumVal - new_a) / width_shape_origin) - new_b) / height_shape_origin);


	float o = getValueFromTensorPos_origin(oPos.r, new_g, new_b, new_a);
    // 归一化数据
    vec4 scale = getPixelsFromTexturePos_texture_scale(vec2( float(new_g) / float(width_texture_scale), 0.0));
    vec4 bias = getPixelsFromTexturePos_texture_bias(vec2((float(new_g)) / float(width_texture_bias), 0.0));
    vec4 mean = getPixelsFromTexturePos_texture_mean(vec2((float(new_g)) / float(width_texture_mean), 0.0));
    vec4 variance = getPixelsFromTexturePos_texture_variance(vec2((float(new_g)) / float(width_texture_variance), 0.0));

    float x = (o - mean[0]) / sqrt(variance[0] + epsilon);
    float res = scale[0] * x + bias[0];
    //float res = float(new_g);
    setOutput(res);
}
`;
