
// 常量
// 池化大小
const int width_shape_pool = WIDTH_SHAPE_POOL;
const int height_shape_pool = HEIGHT_SHAPE_POOL;
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
const int stride_h = STRIDE_HORIZONTAL;
const int stride_v = STRIDE_VERTICAL;
// padding的数目
const int padLeft = PAD_LEFT;
const int padTop = PAD_TOP;


// uniform变量
uniform int numbers_shape_origin[LENGTH_SHAPE_ORIGIN];
uniform int numbers_shape_out[LENGTH_SHAPE_OUT];

// 输入数据
uniform sampler2D texture_origin;
