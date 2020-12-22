/**
 * @file conv2d params
 */

export default function(params) {
    const {
        width_shape_filter: widthShapeFilter,
        height_shape_filter: heightShapeFilter,
        channel_filter: channelFilter,
        total_shape_filter: totalShapeFilter,
        total_shape_origin: totalShapeOrigin,
        width_shape_origin: widthShapeOrigin,
        height_shape_origin: heightShapeOrigin,
        channel_origin: channelOrigin,
        width_shape_out: widthShapeOut,
        height_shape_out: heightShapeOut,
        width_texture_out: widthTextureOut,
        channel_out: channelOut,
        channel_bias: channelBias,
        width_shape_bias: widthShapeBias,
        height_shape_bias: heightShapeBias,
        total_shape_bias: totalShapeBias,
        strides,
        paddings,
        dilations,
        groups,
        binding_origin: bindingOrigin,
        binding_filter: bindingFilter,
        binding_out: bindingOut,
        binding_bias: bindingBias
    } = params;

    return `

    // 卷积核
    const int width_shape_filter = ${widthShapeFilter};
    const int height_shape_filter = ${heightShapeFilter};
    const int channel_filter = ${channelFilter};
    const int total_shape_filter = ${totalShapeFilter};

    // origin
    const int total_shape_origin = ${totalShapeOrigin};
    const int width_shape_origin = ${widthShapeOrigin};
    const int height_shape_origin = ${heightShapeOrigin};
    const int channel_origin = ${channelOrigin};

    // bias
    const int channel_bias = ${channelBias};
    const int width_shape_bias = ${widthShapeBias};
    const int height_shape_bias = ${heightShapeBias};
    const int total_shape_bias = ${totalShapeBias};
    // output
    const int width_shape_out = ${widthShapeOut};
    const int height_shape_out = ${heightShapeOut};
    const int width_texture_out = ${widthTextureOut};
    const int channel_out = ${channelOut};

    // 计算相关
    // 拆分步长
    const int stride_h = ${strides[0]};
    const int stride_v = ${strides[1]};
    // padding的数目
    const int padLeft = ${paddings[0]};
    const int padTop = ${paddings[1]};
    // dilation膨胀系数
    const int dilation_h = ${dilations[0]};
    const int dilation_v = ${dilations[1]};
    // groups
    const int groups = ${groups};

    layout(std430, set = 0, binding = ${bindingBias}) readonly buffer BiasMatrix {
        float numbers[];
    } biasMatrix;

    layout(std430, set = 0, binding = ${bindingOrigin}) readonly buffer Origin {
        float numbers[];
    } originMatrix;

    layout(std430, set = 0, binding = ${bindingFilter}) readonly buffer Filter {
        float numbers[];
    } filterMatrix;

    layout(std430, set = 0, binding = ${bindingOut}) buffer Out {
        float numbers[];
    } outMatrix;

    `;
}
