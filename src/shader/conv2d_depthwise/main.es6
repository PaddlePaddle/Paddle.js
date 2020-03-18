/* eslint-disable */
/**
 * @file 主函数
 * @author yangmingming
 */
export default `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPosLIMIT_OUT();

         // 重排遍历顺序
        int sumVal = oPos.g + oPos.a * channel_out + oPos.b * channel_out * width_shape_out;
        ivec4 new_oPos = transferFromNHWCtoNCHW(sumVal, channel_out, width_shape_out, height_shape_out, total_shape_out);
        int x = new_oPos.a;
        int c = new_oPos.g;
        int y = new_oPos.b;
        int b = new_oPos.r;
        float res = 0.0;

        int top = y * stride_v - padTop;
        int left = x * stride_h - padLeft;
        for (int fy = 0; fy < height_shape_filter; fy++) {
          int oy = top + fy * dilation_v;
          if (oy >= height_shape_origin) {
              break;
          }
          if (oy < 0) {
            continue;
          }
          for (int fx = 0; fx < width_shape_filter; fx++) {
            int ox = left + fx * dilation_h;
            if (ox >= width_shape_origin) {
                break;
            }
            if (ox < 0) {
                continue;
            }
            // b默认是0
            float f = getValueFromTensorPosLIMIT_FILTER_filter(c, 0, fy, fx);
            float o = getValueFromTensorPosLIMIT_ORIGIN_origin(b, c, oy, ox);
            res += f * o;
          }
        }
        setOutput(res);
    }
`;
