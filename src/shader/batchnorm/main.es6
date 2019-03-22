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
    for (int i = 0; i < 4; i++) {
        int n = getArrayIndexFromTexturePos_texture_out(vec3(outCoord.x, outCoord.y, float(i)));
        if (n < total_shape_origin) {
            // 获取output的坐标
            ivec4 outPos = getTensorPosFromArrayIndex_out(n);
            int start = getArrayIndexFromTensorPos_origin(ivec4(outPos[0], outPos[1], 0, 0));
            // 总和 
            float sum = getRangeSumFromArrayIndex_texture_origin(start);
            // 均值
            float mean = sum / float(height_shape_origin * width_shape_origin);
            // 标准差
            float std = getRangePowSumFromArrayIndex_texture_origin(start, 2.0, mean) / 
                float(height_shape_origin * width_shape_origin);
            // 归一化
            float x = (v4[i] - mean) / sqrt(std + epsilon);
            // 重构变换
            vec3 bsPos = getTexturePosFromArrayIndex_texture_scale(outPos[1]);
            float scale = getValueFromTexturePos_texture_scale(bsPos);
            float bias = getValueFromTexturePos_texture_bias(bsPos);
            v4[i] = scale * x + bias;
        }
    }

    gl_FragColor = v4;
}
`;
