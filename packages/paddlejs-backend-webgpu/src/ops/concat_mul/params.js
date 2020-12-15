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
        append_num: appendNum,
        inputs_dim: inputsDim,
        total_shape_appender = 0,
        width_shape_appender = 0,
        height_shape_appender = 0,
        channel_appender = 0
    } = params;

    return  `
    // 输入数据
    const int dim = ${dim};
    const int inputs_dim = ${inputsDim};
    const int append_num = ${appendNum};

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

    const int height_shape_appender = ${height_shape_appender};
    const int width_shape_appender = ${width_shape_appender};
    const int total_shape_appender = ${total_shape_appender};
    const int channel_appender = ${channel_appender};


    const int height_shape_out = ${heightShapeOut};
    const int width_shape_out = ${widthShapeOut};
    const int width_texture_out = ${widthTextureOut};
    const int channel_out = ${channelOut};


    layout(std430, set = 0, binding = BINDING_ORIGIN) readonly buffer OriginMatrix {
        float numbers[];
    } originMatrix;
    
    layout(std430, set = 0, binding = BINDING_COUNTER) readonly buffer CounterMatrix {
        float numbers[];
    } counterMatrix;

    layout(std430, set = 0, binding = BINDING_APPENDER) readonly buffer AppenderMatrix {
        float numbers[];
    } appenderMatrix;
    
    layout(std430, set = 0, binding = BINDING_OUT) buffer ResultMatrix {
        float numbers[];
    } resultMatrix;

    `;
}
