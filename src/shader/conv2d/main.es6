/* eslint-disable */
/**
 * @file 主函数
 * @author yangmingming
 */
export default `
    // start函数
    void main(void) {
        vec2 v2;
        v2.xy = vCoord.xy;
        // 获取原始长度
        vec2 outCoord = moveTexture2PosToReal_texture_out(v2);
        // 输出数据
        vec4 v4;
        int n = getArrayIndexFromTexturePos_texture_out(vec3(outCoord.x, outCoord.y, 0.0));
        // X、Y方向的移动步长
        for (int i = 0; i < 4; i++) {
            // 获取output的坐标
            ivec4 outPos = getTensorPosFromArrayIndex_out(n + i);
            int oTensorChannel = int(floor(float(outPos[1]) / float(channel_out / groups))) * channel_filter;
            int oy = (outPos[2] * stride_v) - padTop;
            for (int fy = 0; fy < height_shape_filter; fy++) {
                if (oy >= height_shape_origin) {
                    break;
                }
                if (oy < 0) {
                    oy += dilation_v;
                    continue;
                }
                int ox = (outPos[3] * stride_h) - padLeft;
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
                        // filter数据
                        int fIndex = getArrayIndexFromTensorPos_filter(ivec4(outPos[1], j, fy, fx));
                        vec3 fPos = getTexturePosFromArrayIndex_texture_filter(fIndex);
                        // origin数据, channel需要和groups适配
                        int oIndex = getArrayIndexFromTensorPos_origin(ivec4(outPos[0], oTensorChannel + j, oy, ox));
                        vec3 oPos = getTexturePosFromArrayIndex_texture_origin(oIndex);
                        v4[i] += (getValueFromTexturePos_texture_filter(fPos) *
                            getValueFromTexturePos_texture_origin(oPos));
                    }
                    ox += dilation_h;
                }
                oy += dilation_v;
            }
        }
        gl_FragColor = v4;
    }
`;
