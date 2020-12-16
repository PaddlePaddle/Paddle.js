/**
 * @file split参数文件
 */
export default function(params) {

    const {
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
        num,
        target_length: targetLength
    } = params;

    return `
    // 常量
    const int dim = ${dim};
    const int num = ${num};
    const int target_length = ${targetLength};

    // origin
    const int total_shape_origin = ${totalShapeOrigin};
    const int width_shape_origin = ${widthShapeOrigin};
    const int height_shape_origin = ${heightShapeOrigin};
    const int width_texture_origin = ${widthTextureOrigin};
    const int channel_origin = ${channelOrigin};

    const int height_shape_out = ${heightShapeOut};
    const int width_shape_out = ${widthShapeOut};
    const int width_texture_out = ${widthTextureOut};
    const int channel_out = ${channelOut};

    // 输入数据
    layout(std430, set = 0, binding = BINDING_ORIGIN) readonly buffer OriginMatrix {
        float numbers[];
    } originMatrix;

    // 输出数据
    layout(std430, set = 0, binding = BINDING_OUT) buffer ResultMatrix {
        float numbers[];
    } resultMatrix;
    `;
}