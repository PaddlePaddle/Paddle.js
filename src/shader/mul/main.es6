/* eslint-disable */
/**
 * @file mul主函数
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
        for (int j = 0; j < width_shape_origin; j++) {
            // counter数据
            int f_index = getArrayIndexFromTensorPos_counter(ivec4(out_pos[0], out_pos[1], j, out_pos[3]));
            vec3 f_pos = getTexturePosFromArrayIndex_texture_counter(f_index);
            // origin数据
            int o_ndex = getArrayIndexFromTensorPos_origin(ivec4(out_pos[0], out_pos[1], out_pos[2], j));
            vec3 o_pos = getTexturePosFromArrayIndex_texture_origin(o_ndex);
            
            v4[i] += (getValueFromTexturePos_texture_counter(f_pos) *
            getValueFromTexturePos_texture_origin(o_pos));
        }
    }
    gl_FragColor = v4;
}
`;
