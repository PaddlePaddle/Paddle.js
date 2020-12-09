/**
 * @file conv2d main
 */

export default `
    void main() {
        ivec4 oPos = getOutputTensorPos();
        float o1 = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        int b = oPos.r;
        int c = oPos.g;
        int y = oPos.b;
        int x = oPos.a;
        float res = 0.0;

        // 获取output的坐标
        int oTensorChannel = (c / (channel_out / groups)) * channel_filter;
        int oy = y * stride_v - padTop;
        float mm = 0.0;
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
                for (int j = 0; j < channel_filter; j++) {
                    float f = getValueFromTensorPos_filter(c, j, fy, fx);
                    float o = getValueFromTensorPos_origin(b, oTensorChannel + j, oy, ox);
                    mm = o;
                    res += f * o;
                }
                ox += dilation_h;
            }
            oy += dilation_v;
        }

        ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);

        int index = resultCell.y + resultCell.x * width_texture_out;
        outMatrix.numbers[index] = res;
    }
`;
