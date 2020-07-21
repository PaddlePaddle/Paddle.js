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
        int temp_x = 0;
        int temp_y = 0;
        float o = 0.0;
        float f = 0.0;
        
        // 获取output的坐标
        int oTensorChannel = int(c * groups / channel_out) * channel_origin;
        int oy = y - padTop;
        for (int fy = 0; fy < height_shape_filter; fy++) {
            if (oy < 0) {
                oy += dilation_v;
                continue;
            }
            int ox = x - padLeft;
            for (int fx = 0; fx < width_shape_filter; fx++) {

                if (ox < 0) {
                    ox += dilation_h;
                    continue;
                }
                // channel计算
                for (int j = 0; j < channel_origin; j++) {
                	if (int(mod(float(ox), float(stride_h))) == 0 && int(mod(float(oy), float(stride_v))) == 0) {
						temp_x = int(floor(float(ox) / float(stride_h)));
						temp_y = int(floor(float(oy) / float(stride_v)));
                        if (temp_x < width_shape_origin && temp_y < height_shape_origin){
						    o = getValueFromTensorPosLIMIT_ORIGIN_origin(b, j, temp_y, temp_x);
                            f = getValueFromTensorPosLIMIT_FILTER_filter(j, c, height_shape_filter-1-fy, width_shape_filter-1-fx);
                            res += f * o;
                        }
					}
                }
                ox += dilation_h;
            }
            oy += dilation_v;
        }
        setOutput(float(res));
    }
`;
