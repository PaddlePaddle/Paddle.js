export default `
// mul的input数据
// 常量
// 输入数据
const int length_shape_counter = LENGTH_SHAPE_COUNTER;
const int width_shape_counter = WIDTH_SHAPE_COUNTER;
const int height_shape_counter = HEIGHT_SHAPE_COUNTER;
const int width_texture_counter = WIDTH_TEXTURE_COUNTER;
const int height_texture_counter = HEIGHT_TEXTURE_COUNTER;
const int channel_counter = CHANNEL_COUNTER;

const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
const int channel_origin = CHANNEL_ORIGIN;

// 输出数据
const int width_shape_out = WIDTH_SHAPE_OUT;
const int height_shape_out = HEIGHT_SHAPE_OUT;
const int width_texture_out = WIDTH_TEXTURE_OUT;
const int height_texture_out = HEIGHT_TEXTURE_OUT;
const int channel_out = CHANNEL_OUT;
const int length_shape_out = LENGTH_SHAPE_OUT;

// uniform变量
// 输入数据
uniform int numbers_shape_counter[LENGTH_SHAPE_COUNTER];
uniform int numbers_shape_origin[LENGTH_SHAPE_ORIGIN];
uniform sampler2D texture_counter;
uniform sampler2D texture_origin;
// 输出数据
uniform int numbers_shape_out[LENGTH_SHAPE_OUT];
`
