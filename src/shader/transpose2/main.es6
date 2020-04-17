/* eslint-disable */
/**
 * @file transpose主函数
 * @author chenhaoze
 */
export default `
// start函数
void main(void) {
    // 输出数据
	ivec4 oPos = getOutputTensorPos();
	    // 重排遍历顺序
	//int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
	//ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_origin);

	// 转置 坐标变换
	//oPos = new_oPos;
	float o = 0.0;
	if (perm_size == 1) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], oPos[3]);
	}
	else if (perm_size == 2) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[(2 + perm_0)>3?3:(2 + perm_0)], oPos[(2 + perm_1)>3?3:(2 + perm_1)]);
	}
	else if (perm_size == 3) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[(1 + perm_0)>3?3:(1 + perm_0)], oPos[(1 + perm_1)>3?3:(1 + perm_1)], oPos[(1 + perm_2)>3?3:(1 + perm_2)]);
	}
	else if (perm_size == 4) {
		o = getValueFromTensorPos_origin(oPos[perm_0], oPos[perm_1], oPos[perm_2], oPos[perm_3]);
	}


	setOutput(float(o));
}
`;
