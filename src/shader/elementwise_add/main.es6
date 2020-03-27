/* eslint-disable */
/**
 * @file 加法主函数
 * @author yangmingming
 */
export default `
// start函数
void main(void) {
    // 输出数据
    ivec4 oPos = getOutputTensorPos();
    int sumVal = oPos.g + oPos.a * channel_origin + oPos.b * channel_origin * width_shape_origin + oPos.r * channel_origin * width_shape_origin * height_shape_origin;
    float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
	ivec4 pos_counter;
	pos_counter.r = channel_out;
	pos_counter.g = height_shape_origin;
	pos_counter.b = width_shape_origin;
	pos_counter.a = 1;
	int index = 0;
	for (int i = 4 - length_shape_origin + axis; i < 4 - length_shape_origin + axis + length_shape_counter; i++ ){
		if (index > 0) {
			index = index * pos_counter[i];
		}
		index += oPos[i];
	}
	float c = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
	float res = c + o;
	setOutput(res);
}
`;
