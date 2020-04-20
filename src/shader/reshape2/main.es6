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
	int sumVal = oPos.a + oPos.b * width_shape_out + oPos.g * height_shape_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
 	ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_origin, width_shape_origin, height_shape_origin, total_shape_origin);
	float o = getValueFromTensorPos_origin(new_oPos.r, new_oPos.g, new_oPos.b, new_oPos.a);
	setOutput(float(o));
}
`;
