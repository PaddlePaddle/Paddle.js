/* eslint-disable */
/**
 * @file 公共方法
 * @author yangmingming
 */
export default `
float getValueFromTensorPos_TENSOR_NAME(int r, int g, int b, int a) {
    vec4 pixels = TEXTURE2D(texture_TENSOR_NAME, vec2((float(a * channel_TENSOR_NAME + g) + 0.5) / float(width_texture_TENSOR_NAME), (float(r * height_shape_TENSOR_NAME + b) + 0.5) / float(height_texture_TENSOR_NAME)));
    return pixels.r;
}

float getValueFromTensorPosPacked_TENSOR_NAME(int r, int g, int b, int a) {
    int y = b / 2;
    int yOffset = int(mod(float(b), 2.0));
    int x = a / 2;
    int xOffset = int(mod(float(a), 2.0));
    vec4 pixels = TEXTURE2D(texture_TENSOR_NAME, vec2((float(x) + 0.5) / float(width_texture_TENSOR_NAME), (float(g * height_shape_TENSOR_NAME + y) + 0.5) / float(height_texture_TENSOR_NAME)));
    int index = 0;
    if (xOffset == 0 && yOffset == 0) {
        return pixels[0];
    } 
    else if (xOffset == 1 && yOffset == 0) {
        return pixels[1];
    }
    else if (xOffset == 0 && yOffset == 1) {
        return pixels[2];
    }
    return pixels[3];
}

float getValueFromTensorPos_TENSOR_NAME(ivec4 pos) {
    float offset = 0.5;
    float width = float(pos.a * channel_TENSOR_NAME + pos.g) + offset;
    float height = float(pos.r * height_shape_TENSOR_NAME + pos.b) + offset;
    vec4 pixels = TEXTURE2D(texture_TENSOR_NAME, vec2(width / float(width_texture_TENSOR_NAME), height / float(height_texture_TENSOR_NAME)));
    return pixels.r;
}
`;
