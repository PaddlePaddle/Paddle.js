/* eslint-disable */
/**
 * @file split主函数
 * @author zhangjingyuan02
 */
export default `
// start函数
void main(void) {
<<<<<<< HEAD
    int length = int(target_length / num);
=======
    int length = int(target_value.length() / num);
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
    ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
	//int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
    //ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_out);
    oPos[dim] = oPos[dim] + layer_run_time * length;
	float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
	setOutput(float(o));
}
`;
