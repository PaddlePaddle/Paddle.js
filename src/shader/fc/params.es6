/* eslint-disable */
/**
 * @file fc参数文件
 */
export default `
// mul的input数据
// 常量
// 输入数据
// weight
const int length_shape_weight = LENGTH_SHAPE_WEIGHT;
const int width_shape_weight = WIDTH_SHAPE_WEIGHT;
const int height_shape_weight = HEIGHT_SHAPE_WEIGHT;
const int width_texture_weight = WIDTH_TEXTURE_WEIGHT;
const int height_texture_weight = HEIGHT_TEXTURE_WEIGHT;
const int channel_weight = CHANNEL_WEIGHT;

//input
const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
const int channel_origin = CHANNEL_ORIGIN;

// bias
const int width_shape_bias = WIDTH_SHAPE_BIAS;
const int height_shape_bias = HEIGHT_SHAPE_BIAS;
const int length_shape_bias = LENGTH_SHAPE_BIAS;
const int width_texture_bias = WIDTH_TEXTURE_BIAS;
const int height_texture_bias = HEIGHT_TEXTURE_BIAS;
const int channel_bias = CHANNEL_BIAS;


// uniform变量
// 输入数据
uniform sampler2D texture_weight;
uniform sampler2D texture_origin;
uniform sampler2D texture_bias;
`;
