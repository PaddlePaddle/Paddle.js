// conv2d的input数据

// 常量
// 卷积核
const int length_shape_filter = LENGTH_SHAPE_FILTER;
const int width_shape_filter = WIDTH_SHAPE_FILTER;
const int height_shape_filter = HEIGHT_SHAPE_FILTER;
const int width_texture_filter = WIDTH_TEXTURE_FILTER;
const int height_texture_filter = HEIGHT_TEXTURE_FILTER;

// 输入数据
const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;

// 输出数据
const int width_shape_out = WIDTH_SHAPE_OUT;
const int height_shape_out = HEIGHT_SHAPE_OUT;

// 计算相关
// 拆分步长
const int stride_h = STRIDE_HORIZONTAL;
const int stride_v = STRIDE_VERTICAL;
// padding的数目
const int padLeft = PAD_LEFT;
const int padTop = PAD_TOP;
// dilation膨胀系数
const int dilation_h = DILATION_HORIZONTAL;
const int dilation_v = DILATION_VERTICAL;


// uniform变量
// 卷积核
uniform int numbers_shape_filter[LENGTH_SHAPE_FILTER];
uniform sampler2D texture_filter;

// 输入数据
uniform sampler2D texture_origin;


// varying变量
// 顶点shader透传的材质坐标
varying vec2 vCoord;

