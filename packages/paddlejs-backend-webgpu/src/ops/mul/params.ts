/**
 * @file mul参数文件
 */

export default function(params) {
    const {
        width_texture_counter: widthTextureCounter,
        width_texture_origin: widthTextureOrigin,
        binding_origin: bindingOrigin,
        binding_counter: bindingCounter,
        binding_out: bindingOut
    } = params;

    return `
    const int width_texture_counter = ${widthTextureCounter};
    const int width_texture_origin = ${widthTextureOrigin};

    layout(std430, set = 0, binding = ${bindingOrigin}) readonly buffer OriginMatrix {
        float numbers[];
    } originMatrix;
    layout(std430, set = 0, binding = ${bindingCounter}) readonly buffer CounterMatrix {
        float numbers[];
    } counterMatrix;
    layout(std430, set = 0, binding = ${bindingOut}) buffer ResultMatrix {
        float numbers[];
    } resultMatrix;
    `;

}