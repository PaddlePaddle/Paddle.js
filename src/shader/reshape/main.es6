/* eslint-disable */
/**
 * @file reshape主函数
 * @author chenhaoze
 */
export default `
// start函数
void main(void) {
    // 输出数据
	ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
	int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
	int n_origin = int(total_shape_origin/(channel_origin * width_shape_origin * height_shape_origin));
	int new_a = sumVal % width_shape_origin;
	sumVal = int((sumVal - new_a) / width_shape_origin);
	int new_b = sumVal % height_shape_origin;
	sumVal = int((sumVal - new_b) / height_shape_origin);
	int new_g = sumVal % channel_origin;
	sumVal = int((sumVal - new_g) / channel_origin);
	int new_r = sumVal % n_origin;
	float o = getValueFromTensorPos_origin(new_r,new_g,new_b,new_a);
	setOutput(float(o));
}
`;
