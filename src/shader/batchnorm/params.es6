/* eslint-disable */
/**
 * @file batchnorm参数文件
 * @author yangmingming
 */
export default `
// 输入数据
const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
const int channel_origin = CHANNEL_ORIGIN;
const int total_shape_origin = TOTAL_SHAPE_ORIGIN;

// 输出数据
const int width_shape_out = WIDTH_SHAPE_OUT;
const int height_shape_out = HEIGHT_SHAPE_OUT;
const int width_texture_out = WIDTH_TEXTURE_OUT;
const int height_texture_out = HEIGHT_TEXTURE_OUT;
const int channel_out = CHANNEL_OUT;
const int length_shape_out = LENGTH_SHAPE_OUT;

// 计算数据
const float epsilon = float(EPSILON);
const int width_texture_scale = WIDTH_TEXTURE_SCALE;
const int height_texture_scale = HEIGHT_TEXTURE_SCALE;
const int width_texture_bias = WIDTH_TEXTURE_BIAS;
const int height_texture_bias = HEIGHT_TEXTURE_BIAS;

// uniform变量
uniform int numbers_shape_origin[LENGTH_SHAPE_ORIGIN];
uniform int numbers_shape_out[LENGTH_SHAPE_OUT];

// 输入数据
uniform sampler2D texture_origin;
uniform sampler2D texture_scale;
uniform sampler2D texture_bias;
`;
