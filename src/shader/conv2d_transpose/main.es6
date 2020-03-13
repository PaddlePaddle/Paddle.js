/* eslint-disable */
/**
 * @file 主函数
 * @author chenhaoze
 */
export default `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPosLIMIT_OUT();
        int x = oPos.a;
        int c = oPos.g;
        int y = oPos.b;
        int b = oPos.r; 
        float res = 0.0;

// 重排遍历顺序
//int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out;
//int new_a = sumVal % width_shape_out;
//int new_b = int((sumVal - new_a) / width_shape_out) % height_shape_out;
//int new_g = int((((sumVal - new_a) / width_shape_out) - new_b) / height_shape_out);
//int x = new_a;
//int c = new_g;
//int y = new_b;
        // 获取output的坐标
        int oTensorChannel = (c / (channel_out / groups)) * channel_filter;

        int oy = y * 1 - padTop;
        for (int fy = 0; fy < height_shape_filter; fy++) {
            if (oy >= height_shape_origin) {
                break;
            }
            if (oy < 0) {
                oy += dilation_v;
                continue;
            }
            int ox = x * 1 - padLeft;
            for (int fx = 0; fx < width_shape_filter; fx++) {
                if (ox >= width_shape_origin) {
                    break;
                }
                if (ox < 0) {
                    ox += dilation_h;
                    continue;
                }
                // channel计算
                for (int j = 0; j < channel_filter; j++) {
					float o = 0.0;
                	if (ox % stride_h == 0 && oy % stride_v == 0) {
						int temp_x = int(ox / stride_h);
						int temp_y = int(oy / stride_v);
						o = getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + j, temp_y, temp_x);
					}
                    float f = getValueFromTensorPosLIMIT_FILTER_filter(c, j, fy, fx);
                    res += f * o;
                }
                ox += dilation_h;
            }
            oy += dilation_v;
        }
        setOutput(res);
    }
`;
