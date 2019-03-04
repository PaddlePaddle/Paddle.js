// TEXTURE_NAME, 材质name
// WIDTH_RAW_TEXTURE_NAME_VALUE, 材质原始宽度
// HEIGHT_RAW_TEXTURE_NAME_VALUE, 材质原始高度

// const int width_raw_TEXTURE_NAME = WIDTH_RAW_TEXTURE_NAME_VALUE;
// const int height_raw_TEXTURE_NAME = HEIGHT_RAW_TEXTURE_NAME_VALUE;

// 材质坐标转化成真实尺寸坐标
vec2 moveTexture2PosToReal_TEXTURE_NAME(vec2 v) {
    vec2 v2;
    v2.x = v.x * float(width_raw_TEXTURE_NAME);
    v2.y = v.y * float(height_raw_TEXTURE_NAME);
    return v2;
}
