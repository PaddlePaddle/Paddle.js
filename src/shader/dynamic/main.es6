/* eslint-disable */
/**
 * @file 主函数
 * @author yangmingming
 */
export default `
// start函数
void main(void) {
    vec4 pixels = getPixelsFromTexturePos_texture_origin(vCoord);
    vec4 v4 = vec4(
        ACTIVE_FUNCTION(pixels.r, multi_value, bias_value),
        ACTIVE_FUNCTION(pixels.g, multi_value, bias_value),
        ACTIVE_FUNCTION(pixels.b, multi_value, bias_value),
        ACTIVE_FUNCTION(pixels.a, multi_value, bias_value)
    );
    gl_FragColor = v4;
}
`;
