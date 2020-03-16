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
    ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_origin, width_shape_origin, height_shape_origin, total_shape_origin);
	//ivec4 new_oPos = oPos;
    float o = getValueFromTensorPos_origin(new_oPos.r, new_oPos.g, new_oPos.b, new_oPos.a);
	ivec4 pos_counter;
	pos_counter.r = channel_out;
	pos_counter.g = height_shape_origin;
	pos_counter.b = width_shape_origin;
	pos_counter.a = 1;
	int index = 0;
	for (int i = 4 - shape_length_origin + axis; i < 4 - shape_length_origin + axis + shape_length_counter; i++ ){
		if (index > 0) {
			index = index * pos_counter[i];
		}
		index += new_oPos[i];
	}
	float c = getValueFromCounter(index);
	float res = c + o;
    //float res = ACTIVE_FUNCTION(o + c, multi_value, bias_value);
    setOutput(res);
}
`;
