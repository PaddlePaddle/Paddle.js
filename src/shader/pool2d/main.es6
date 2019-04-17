/* eslint-disable */
/**
 * @file pool2d主函数
 */
export default `
// start函数
void main(void) {
    vec2 v2;
    v2.xy = vCoord.xy;
    // 获取原始长度
    vec2 out_coord = moveTexture2PosToReal_texture_out(v2);
    // 输出数据
    vec4 v4;
    int n = getArrayIndexFromTexturePos_texture_out(vec3(out_coord.x, out_coord.y, 0.0));
    for (int i = 0; i < 4; i++) {
        // 获取output的坐标
        ivec4 out_pos = getTensorPosFromArrayIndex_out(n + i);
        v4[i] = 0.0;
        // X、Y方向的移动步长
        int count_pool = 0;
        int oy_base = (out_pos[2] * stride_v) - padTop;
        int ox_base = (out_pos[3] * stride_h) - padLeft;
        for (int fy = 0; fy < height_shape_pool; fy++) {
            int oy = oy_base + fy;
            if (oy >= height_shape_origin) {
                break;
            }
            if (oy < 0) {
                continue;
            }
            for (int fx = 0; fx < width_shape_pool; fx++) {
                int ox = ox_base + fx;
                if (ox >= width_shape_origin) {
                    break;
                }
                if (ox < 0) {
                    continue;
                }
                // origin数据
                int o_index = getArrayIndexFromTensorPos_origin(ivec4(out_pos[0], out_pos[1], oy, ox));
                vec3 o_pos = getTexturePosFromArrayIndex_texture_origin(o_index);
                float curr = getValueFromTexturePos_texture_origin(o_pos);
                if (type_pool == 1) {
                    if (curr > v4[i]) {
                        v4[i] = curr;
                    }
                } else {
                    v4[i] += curr;
                    // 在平均池化模式忽略填充值(exclusive默认为true）
                    count_pool++;
                }
            }
        }
        if (type_pool != 1) {
            v4[i] = v4[i] / float(count_pool);
        }
    }
    gl_FragColor = v4;
}
`;
