/* eslint-disable */
/**
 * @file softmax主函数
 * @author yangmingming
 */
export default `
// start函数
void main(void) {
    // 输出数据
    vec4 v4 = getPixelsFromTexturePos_texture_origin(vCoord);
    // 获取原始长度
    vec2 outCoord = moveTexture2PosToReal_texture_out(vCoord);
    int n = getArrayIndexFromTexturePos_texture_out(vec3(outCoord.x, outCoord.y, 0.0));
    for (int i = 0; i < 4; i++) {
        // if (n < total_shape_origin) {
            // 获取output的坐标
            ivec4 outPos = getTensorPosFromArrayIndex_out(n + i);
            vec3 bsPos = getTexturePosFromArrayIndex_texture_scale(outPos[1] * 4);
            vec4 scale = getPixelsFromTexturePos_texture_scale(bsPos.xy);
            // 归一化
            float x = (v4[i] - scale[3]) / sqrt(scale[2] + epsilon);
            v4[i] = scale[0] * x + scale[1];
        // }
    }

    gl_FragColor = v4;
}
`;
