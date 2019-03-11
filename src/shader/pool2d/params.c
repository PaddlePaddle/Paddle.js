
// 常量
// 池化大小
const int width_shape_pool = KSIZE_X;
const int height_shape_pool = KSIZE_Y;
const int type_pool = TYPE_POOL;
// 输入数据
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

// 计算相关
// 拆分步长
const int stride_h = STRIDES_X;
const int stride_v = STRIDES_Y;
// padding的数目
const int padLeft = PADDING_X;
const int padTop = PADDING_Y;


// uniform变量
// 输入数据
uniform int numbers_shape_origin[LENGTH_SHAPE_ORIGIN];
uniform sampler2D texture_origin;
// 输出数据
uniform int numbers_shape_out[LENGTH_SHAPE_OUT];
