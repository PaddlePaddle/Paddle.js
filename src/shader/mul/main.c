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

        // filter数据
        int fIndex = getArrayIndexFromTensorPos_filter(ivec4(outPos[0], outPos[1], outPos[2], outPos[3]));
        vec3 fPos = getTexturePosFromArrayIndex_texture_filter(fIndex);
        // origin数据
        int oIndex = getArrayIndexFromTensorPos_origin(ivec4(outPos[0], outPos[1], outPos[2], outPos[3]));
        vec3 oPos = getTexturePosFromArrayIndex_texture_origin(oIndex);
        v4[i] = (getValueFromTexturePos_texture_filter(fPos) +
            getValueFromTexturePos_texture_origin(oPos));
    }
    gl_FragColor = v4;
}
