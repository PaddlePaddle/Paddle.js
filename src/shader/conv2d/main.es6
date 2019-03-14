/* eslint-disable */
/**
 * @file 主函数
 * @author yangmingming
 */
export default `
    // start函数
    void main(void) {
        vec2 v2;
        v2.x = vCoord.x;
        v2.y = vCoord.y;
        // 获取原始长度
        vec2 outCoord = moveTexture2PosToReal_texture_out(v2);
        // 输出数据
        vec4 v4;
        for (int i = 0; i < 4; i++) {
            int n = getArrayIndexFromTexturePos_texture_out(vec3(outCoord.x, outCoord.y, float(i)));
            // 获取output的坐标
            ivec4 outPos = getTensorPosFromArrayIndex_out(n);
    
            // X、Y方向的移动步长
            int disX = -padLeft;
            int disY = -padTop;
            for (int fy = 0; fy < height_shape_filter; fy++) {
                int oy = (outPos[2] * stride_v) + (fy * dilation_v + disY);
                for (int fx = 0; fx < width_shape_filter; fx++) {
                    int ox = (outPos[3] * stride_h) + (fx * dilation_h + disX);
                    if (oy >= 0 && oy < (height_shape_origin) && ox >= 0 && ox < (width_shape_origin)) {
                        // channel计算
                        for (int j = 0; j < channel_filter; j++) {
                            // filter数据
                            int fIndex = getArrayIndexFromTensorPos_filter(ivec4(outPos[1], j, fy, fx));
                            vec3 fPos = getTexturePosFromArrayIndex_texture_filter(fIndex);
                            // origin数据
                            int oIndex = getArrayIndexFromTensorPos_origin(ivec4(outPos[0], j, oy, ox));
                            vec3 oPos = getTexturePosFromArrayIndex_texture_origin(oIndex);
                            v4[i] += (getValueFromTexturePos_texture_filter(fPos) *
                                getValueFromTexturePos_texture_origin(oPos));
                        }
                    }
                }
            }
        }
        // 激活函数
        v4 = vec4(
            ACTIVE_FUNCTION(v4.r, multi_value, bias_value),
            ACTIVE_FUNCTION(v4.g, multi_value, bias_value),
            ACTIVE_FUNCTION(v4.b, multi_value, bias_value),
            ACTIVE_FUNCTION(v4.a, multi_value, bias_value)
        );
        gl_FragColor = v4;
    }
`;
