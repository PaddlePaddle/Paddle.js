/* eslint-disable */
/**
 * @file 加法参数
 * @author yangmingming
 */
export default `
    // 输入数据
    const int axis = AXIS;
    const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
    const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
    const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
    const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
    const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
    const int channel_origin = CHANNEL_ORIGIN;

    const int height_shape_counter = HEIGHT_SHAPE_COUNTER;
    const int width_shape_counter = WIDTH_SHAPE_COUNTER;
    const int length_shape_counter = LENGTH_SHAPE_COUNTER;
    const int width_texture_counter = WIDTH_TEXTURE_COUNTER;
    const int height_texture_counter = HEIGHT_TEXTURE_COUNTER;
    const int channel_counter = CHANNEL_COUNTER;
    
    uniform sampler2D texture_origin;
	uniform sampler2D texture_counter;

`;
