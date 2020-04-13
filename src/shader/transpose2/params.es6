/* eslint-disable */
/**
 * @file batchnorm参数文件
 * @author chenhaoze
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


const int perm_size = PERM_SIZE;
const int perm_0 = PERM_0;
const int perm_1 = PERM_1;
const int perm_2 = PERM_2;
const int perm_3 = PERM_3;

// 输入数据
 uniform sampler2D texture_origin;
`;
