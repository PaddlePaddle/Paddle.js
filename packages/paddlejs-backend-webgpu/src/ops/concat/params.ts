/**
 * @file params
 */

export default function(params) {

    const {
        width_shape_counter: widthShapeCounter,
        height_shape_counter: heightShapeCounter,
        channel_counter: channelCounter,
        total_shape_counter: totalShapeCounter,
        total_shape_origin: totalShapeOrigin,
        width_shape_origin: widthShapeOrigin,
        height_shape_origin: heightShapeOrigin,
        width_texture_origin: widthTextureOrigin,
        channel_origin: channelOrigin,
        width_shape_out: widthShapeOut,
        height_shape_out: heightShapeOut,
        width_texture_out: widthTextureOut,
        channel_out: channelOut,
        dim,
        inputs_dim: inputsDim,
        binding_origin: bindingOrigin,
        binding_counter: bindingCounter,
        binding_out: bindingOut
    } = params;

    return  `
    // 输入数据
    const int dim = ${dim};
    const int inputs_dim = ${inputsDim};

    // origin
    const int total_shape_origin = ${totalShapeOrigin};
    const int width_shape_origin = ${widthShapeOrigin};
    const int height_shape_origin = ${heightShapeOrigin};
    const int width_texture_origin = ${widthTextureOrigin};
    const int channel_origin = ${channelOrigin};


    const int height_shape_counter = ${heightShapeCounter};
    const int width_shape_counter = ${widthShapeCounter};
    const int total_shape_counter = ${totalShapeCounter};
    const int channel_counter = ${channelCounter};

    const int height_shape_out = ${heightShapeOut};
    const int width_shape_out = ${widthShapeOut};
    const int width_texture_out = ${widthTextureOut};
    const int channel_out = ${channelOut};


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
