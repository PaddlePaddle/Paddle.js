// start函数
void main(void) {
    vec2 v2;
    v2.x = vCoord.x;
    v2.y = vCoord.y;
    // 获取原始长度
    vec2 outCoord = moveTexture2PosToReal_canvas(v2);
    // 输出数据
    vec4 v4;
    if (outCoord.x < float(width_shape_out) && outCoord.y < float(height_shape_out)) {
        float result_r = 0.0;
        float result_g = 0.0;
        float result_b = 0.0;
        float result_a = 0.0;
        // X、Y方向的移动步长
        int disX = -padLeft;
        int disY = -padTop;
        vec2 oriCoord;
        for (int fy = 0; fy < height_shape_filter; fy++) {
            float oy = floor(outCoord.y) * float(stride_v) + float(fy * dilation_v + disY);
            for (int fx = 0; fx < width_shape_filter; fx++) {
                float ox = floor(outCoord.x) * float(stride_h) + float(fx * dilation_h + disX);
                if (oy >= 0.0 && oy < float(height_shape_origin) && ox >= 0.0 && ox < float(width_shape_origin)) {
                    oriCoord.x = ox / float(width_shape_origin);
                    oriCoord.y = oy / float(height_shape_origin);
                    int index = getArrayIndexFromTensorPos_filter(ivec4(0, fy, fx, 0));
                    vec3 pos = getTexturePosFromArrayIndex_texture_filter(index);
                    result_r += getValueFromTexturePos_texture_filter(pos) * texture2D(texture_origin, oriCoord).r;
                    result_g += getValueFromTexturePos_texture_filter(pos) * texture2D(texture_origin, oriCoord).g;
                    result_b += getValueFromTexturePos_texture_filter(pos) * texture2D(texture_origin, oriCoord).b;
                    result_a += getValueFromTexturePos_texture_filter(pos) * texture2D(texture_origin, oriCoord).a;
                }
            }
        }
        float result = result_r + result_g + result_b + result_a;
        v4.r = result;
        v4.g = result;
        v4.b = result;
        v4.a = result;
    }
    gl_FragColor = v4;
}
