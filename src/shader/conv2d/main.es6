/* eslint-disable */
/**
 * @file 主函数
 * @author yangmingming
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

        // 获取output的坐标
        int oTensorChannel = (c / (channel_out / groups)) * channel_filter;
        int oy = y * stride_v - padTop;
        for (int fy = 0; fy < height_shape_filter; fy++) {
            if (oy >= height_shape_origin) {
                break;
            }
            if (oy < 0) {
                oy += dilation_v;
                continue;
            }
            int ox = x * stride_h - padLeft;
            for (int fx = 0; fx < width_shape_filter; fx++) {
                if (ox >= width_shape_origin) {
                    break;
                }
                if (ox < 0) {
                    ox += dilation_h;
                    continue;
                }
                // channel计算
                for (int j = 0; j < filter_nearest_vec4; j += 4) {
                    vec4 fValues = vec4(
                        getValueFromTensorPosLIMIT_FILTER_filter(c, j, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, j + 1, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, j + 2, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, j + 3, fy, fx)
                    );   

                    vec4 oValues = vec4(
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + j, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + j + 1, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + j + 2, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + j + 3, oy, ox)
                      );

                    res += dot(fValues, oValues);
                }

                if (filter_remainder_vec4 == 1) {
                    res += dot(
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4, fy, fx), 
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4, oy, ox));
                } else if (filter_remainder_vec4 == 2) {
                    vec2 fValues = vec2(
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4 + 1, fy, fx)
                    );   
                    vec2 oValues = vec2(
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4 + 1, oy, ox)
                      );
                    res += dot(fValues, oValues);
                } else if (filter_remainder_vec4 == 3) {
                    vec3 fValues = vec3(
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4 + 1, fy, fx),
                        getValueFromTensorPosLIMIT_FILTER_filter(c, filter_nearest_vec4 + 2, fy, fx)
                    );   
                    vec3 oValues = vec3(
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4 + 1, oy, ox),
                        getValueFromTensorPosLIMIT_ORIGIN_origin(b, oTensorChannel + filter_nearest_vec4 + 2, oy, ox)
                    );
                    res += dot(fValues, oValues);
                }
                ox += dilation_h;
            }
            oy += dilation_v;
        }

        float bi = getValueFromTensorPosLIMIT_BIAS_bias(0, 0, 0, c);
        res += bi;
        if (fuse_relu) {
            res = max(0.0, res);
        }
        setOutput(res);
    }
`;
