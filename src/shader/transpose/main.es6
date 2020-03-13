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
	    // 重排遍历顺序
	int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
	int suma = sumVal;
	int n_out = int(total_shape_origin / (channel_out * width_shape_out * height_shape_out));
	int new_a = sumVal % width_shape_out;
	sumVal = int((sumVal - new_a) / width_shape_out);
	int new_b = sumVal % height_shape_out;
	sumVal = int((sumVal - new_b) / height_shape_out);
	int new_g = sumVal % channel_out;
	sumVal = int((sumVal - new_g) / channel_out);
	int new_r = sumVal % n_out;
	// 转置 坐标变换
	oPos = ivec4(new_r, new_g, new_b, new_a);
	float o = 0.0;
	if (perm_size == 1) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], oPos[3]);
	}
	else if (perm_size == 2) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[min(2 + perm_0, 3)], oPos[min(2 + perm_1, 3)]);
	}
	else if (perm_size == 3) {
		o = getValueFromTensorPos_origin(oPos[0], oPos[min(1 + perm_0, 3)], oPos[min(1 + perm_1, 3)], oPos[min(1 + perm_2, 3)]);
	}
	else if (perm_size == 4) {
		o = getValueFromTensorPos_origin(oPos[perm_0], oPos[perm_1], oPos[perm_2], oPos[perm_3]);
	}


	setOutput(float(o));
}
`;
