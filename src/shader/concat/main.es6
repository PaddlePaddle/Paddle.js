/* eslint-disable */
/**
 * @file concat主函数
 * @author zhangjingyuan02
 */
export default `
// start函数
void main(void) {
    ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
//	int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
 //   ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_out);
    float o = 0.0;
<<<<<<< HEAD
    if (oPos[dim] > inputs_dim - 1) {
        oPos[dim] = oPos[dim] - inputs_dim;
=======
    if (oPos[dim] > inputs_dim[0] - 1) {
        oPos[dim] = oPos[dim] - inputs_dim[0];
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
        o = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    else {
        o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
    }
	setOutput(float(o));
}
`;
