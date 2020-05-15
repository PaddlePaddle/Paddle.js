/* eslint-disable */
/**
 * @file 公共方法
 * @author yangmingming
 * desc 根据tensor坐标获取这个tensor位置的值
 */
export default `
// 根据tensor坐标获取这个tensor位置的值
float getValueFromTensorPos_TENSOR_NAME(int r, int g, int b, int a) {
    vec4 pixels = TEXTURE2D(texture_TENSOR_NAME,
        vec2(
            (float(a * channel_TENSOR_NAME + g) + 0.5) / float(width_texture_TENSOR_NAME),
            (float(r * height_shape_TENSOR_NAME + b) + 0.5) / float(height_texture_TENSOR_NAME)
        )
    );
    // 只用了r通道
    return pixels.r;
}

// 超限布局根据tensor坐标获取这个tensor位置的值
float getValueFromTensorPosLimit_TENSOR_NAME(int r, int g, int b, int a) {
    float pieceW = ceil(float(width_shape_TENSOR_NAME) / 4.0);
    int x = int(mod(float(a), pieceW));
    int offsetY = 0;

    if ((float(a) / pieceW) >= 3.0) {
        offsetY = 3 * height_shape_TENSOR_NAME;
    }
    else if (float(a) / pieceW >= 2.0) {
        offsetY = 2 * height_shape_TENSOR_NAME;
    }
    else if (float(a) >= pieceW) {
        offsetY = height_shape_TENSOR_NAME;
    }
    vec4 pixels = TEXTURE2D(texture_TENSOR_NAME,
        vec2(
            (float(x * channel_TENSOR_NAME + g) + 0.5) / float(width_texture_TENSOR_NAME),
            (float(r * 4 * height_shape_TENSOR_NAME + b + offsetY) + 0.5) / float(height_texture_TENSOR_NAME)
        )
    );
    return pixels.r;
}

`;
