// TEXTURE_NAME, tensor name
// 获取材质中的像素
// uniform sampler2D TEXTURE_NAME;

vec4 getPixelsFromTexturePos_TEXTURE_NAME(vec2 pos) {
    return texture2D(TEXTURE_NAME, pos);
}
