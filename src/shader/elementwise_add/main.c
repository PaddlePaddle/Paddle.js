// start函数
void main(void) {
    vec4 oPixels = getPixelsFromTexturePos_texture_origin(vCoord);
    vec4 aPixels = getPixelsFromTexturePos_texture_add(vCoord);
    vec4 v4 = vec4(
        ACTIVE_FUNCTION(oPixels.r + aPixels.r, multi_value, bias_value),
        ACTIVE_FUNCTION(oPixels.g + aPixels.g, multi_value, bias_value),
        ACTIVE_FUNCTION(oPixels.b + aPixels.b, multi_value, bias_value),
        ACTIVE_FUNCTION(oPixels.a + aPixels.a, multi_value, bias_value)
    );
    gl_FragColor = v4;
}
