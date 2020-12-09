/**
 * @file mul参数文件
 */
export default function(params) {
    const {
        width_texture_counter: widthTextureCounter,
        width_texture_origin: widthTextureOrigin
    } = params;

    return `
    const int width_texture_counter = ${widthTextureCounter};
    const int width_texture_origin = ${widthTextureOrigin};

    layout(std430, set = 0, binding = BINDING_ORIGIN) readonly buffer OriginMatrix {
        float numbers[];
    } originMatrix;
    layout(std430, set = 0, binding = BINDING_COUNTER) readonly buffer CounterMatrix {
        float numbers[];
    } counterMatrix;
    layout(std430, set = 0, binding = BINDING_OUT) buffer ResultMatrix {
        float numbers[];
    } resultMatrix;
    `;

}