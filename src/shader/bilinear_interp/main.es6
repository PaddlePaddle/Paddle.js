/* eslint-disable */
/**
 * @file bilinear_interp主函数
 * @author chenhaoze
 */
export default `
// start函数
void main(void) {
    // 输出数据
	ivec4 oPos = getOutputTensorPosLIMIT_OUT();
    // 输出坐标转换为输入坐标
	//int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out + oPos.r * channel_out * width_shape_out * height_shape_out;
 	//oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_out);
	float o = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, oPos.b, oPos.a);
	float scale_x = float(width_shape_out - 1) / float(width_shape_origin - 1);
    float scale_y = float(height_shape_out - 1) / float(height_shape_origin - 1);
    float x = float(oPos.a) / scale_x;
    float y = float(oPos.b) / scale_y;
	int x1 = int(floor(x));
	int y1 = int(floor(y));
	int x2 = int(ceil(x));
	int y2 = int(ceil(y));
	float dist_x = x - float(x1);
    float dist_y = y - float(y1);
    float value11 = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, y1, x1);
    float value12 = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, y2, x1);
    float value21 = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, y1, x2);
    float value22 = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, y2, x2);
    float value = (1.0 - dist_x) * (1.0 - dist_y) * value11 +
            (1.0 - dist_x) * dist_y * value12 + dist_x * (1.0 - dist_y) * value21 +
            dist_x * dist_y * value22;
    setOutput(float(value));
}
`;
