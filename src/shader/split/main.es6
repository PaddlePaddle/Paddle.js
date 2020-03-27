/* eslint-disable */
/**
 * @file split主函数
 * @author zhangjingyuan02
 */
export default `
// start函数
void main(void) {
    int length = int(target_value.length() / num);
    ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
	int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
    ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_out);
    new_oPos[dim] = new_oPos[dim] + layer_run_time * length;
	float o = getValueFromTensorPos_origin(new_oPos.r, new_oPos.g, new_oPos.b, new_oPos.a);
	setOutput(float(o));
}
`;
