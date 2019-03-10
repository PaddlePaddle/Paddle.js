// start函数
void main(void) {
    vec4 pixels = getPixelsFromTexturePos_texture_origin(vCoord);
    vec4 pixels2 = getPixelsFromTexturePos_texture_origin2(vCoord);
    vec4 v4 = vec4(
        pixels.r + pixels2.r,
        pixels.g + pixels2.g,
        pixels.b + pixels2.b,
        pixels.a + pixels2.a
    );
    gl_FragColor = v4;
}
