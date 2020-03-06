/* eslint-disable */
/**
 * @file batchnorm参数文件
 * @author wangqun
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
// 计算数据
const float epsilon = float(EPSILON);
const int width_texture_bias = WIDTH_TEXTURE_BIAS;
const int height_texture_bias = HEIGHT_TEXTURE_BIAS;
const int width_texture_variance = WIDTH_TEXTURE_VARIANCE;
const int height_texture_variance = HEIGHT_TEXTURE_VARIANCE;
const int width_texture_mean = WIDTH_TEXTURE_MEAN;
const int height_texture_mean = HEIGHT_TEXTURE_MEAN;
const int width_texture_scale = WIDTH_TEXTURE_SCALE;
const int height_texture_scale = HEIGHT_TEXTURE_SCALE;
// 输入数据
uniform sampler2D texture_origin;
uniform sampler2D texture_scale;
uniform sampler2D texture_bias;
uniform sampler2D texture_variance;
uniform sampler2D texture_mean;
`;
