/* eslint-disable */
/**
 * @file 参数文件
 * @author chenhaoze
 */
export default `
    // conv2d的input数据
    
    // 常量
    // 卷积核
    const int length_shape_filter = LENGTH_SHAPE_FILTER;
    const int width_shape_filter = WIDTH_SHAPE_FILTER;
    const int height_shape_filter = HEIGHT_SHAPE_FILTER;
    const int width_texture_filter = WIDTH_TEXTURE_FILTER;
    const int height_texture_filter = HEIGHT_TEXTURE_FILTER;
    const int channel_filter = CHANNEL_FILTER;
    
    // 输入数据
    const int width_shape_origin = WIDTH_SHAPE_ORIGIN;
    const int height_shape_origin = HEIGHT_SHAPE_ORIGIN;
    const int length_shape_origin = LENGTH_SHAPE_ORIGIN;
    const int width_texture_origin = WIDTH_TEXTURE_ORIGIN;
    const int height_texture_origin = HEIGHT_TEXTURE_ORIGIN;
    const int channel_origin = CHANNEL_ORIGIN;
    
    // 计算相关
    // 拆分步长
    const int stride_h = int(STRIDES_X);
    const int stride_v = int(STRIDES_Y);
    // padding的数目
    const int padLeft = WIDTH_SHAPE_FILTER - PADDINGS_X - 1;
    const int padTop = HEIGHT_SHAPE_FILTER - PADDINGS_Y - 1;

    // dilation膨胀系数
    const int dilation_h = DILATIONS_X;
    const int dilation_v = DILATIONS_Y;
    // groups
    const int groups = GROUPS;
    
    // uniform变量
    // 卷积核
    uniform sampler2D texture_filter;
    
    // 输入数据
    uniform sampler2D texture_origin;
`;
