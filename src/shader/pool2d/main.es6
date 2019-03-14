/* eslint-disable */
/**
 * @file pool2d主函数
 */
export default `
// start函数
void main(void) {
    vec2 v2;
    v2.x = vCoord.x;
    v2.y = vCoord.y;
    // 获取原始长度
    vec2 out_coord = moveTexture2PosToReal_texture_out(v2);
    // 输出数据
    vec4 v4;
    for (int i = 0; i < 4; i++) {
        int n = getArrayIndexFromTexturePos_texture_out(vec3(out_coord.x, out_coord.y, float(i)));
        // 获取output的坐标
        ivec4 out_pos = getTensorPosFromArrayIndex_out(n);
        v4[i] = 0.0;
        // X、Y方向的移动步长
        int dis_x = -padLeft;
        int dis_y = -padTop;
        int count_pool = 0;
        for (int fy = 0; fy < height_shape_pool; fy++) {
            int oy = (out_pos[2] * stride_v) + (fy + dis_y);
            for (int fx = 0; fx < width_shape_pool; fx++) {
                int ox = (out_pos[3] * stride_h) + (fx + dis_x);
                if (oy >= 0 && oy < (height_shape_origin) && ox >= 0 && ox < (width_shape_origin)) {
                    // origin数据
                    int o_index = getArrayIndexFromTensorPos_origin(ivec4(out_pos[0], out_pos[1], oy, ox));
                    vec3 o_pos = getTexturePosFromArrayIndex_texture_origin(o_index);
                    float curr = getValueFromTexturePos_texture_origin(o_pos);
                    if(type_pool == 1) {
                        if (curr > v4[i]) {
                            v4[i] = curr;
                        }
                    }
                    else {
                        v4[i] += curr;
                        // 在平均池化模式忽略填充值(exclusive默认为true）
                        count_pool++;
                    }
                }
            }
        }
        if(type_pool != 1) {
            v4[i] = v4[i] / float(count_pool);
        }
    }
    gl_FragColor = v4;
}
`;
