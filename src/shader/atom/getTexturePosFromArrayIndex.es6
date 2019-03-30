/* eslint-disable */
/**
 * @file 公共方法
 * @author yangmingming
 */
// TEXTURE_NAME, 材质名称
// WIDTH_TEXTURE_NAME_VALUE, 材质宽度
// HEIGHT_TEXTURE_NAME_VALUE, 材质高度

// 获取数组元素索引为N的元素，在texture上的坐标
// const int width_TEXTURE_NAME = WIDTH_TEXTURE_NAME_VALUE;
// const int height_TEXTURE_NAME = HEIGHT_TEXTURE_NAME_VALUE;
export default `
vec3 getTexturePosFromArrayIndex_TEXTURE_NAME(int n) {
    vec3 pos;
    // pos.z = mod(float(n), 4.0);
    // pos.x = mod(float(n) / 4.0, float(width_TEXTURE_NAME));
    // pos.y = float(n) / float(4 * width_TEXTURE_NAME);
    // pos.x = pos.x / float(width_TEXTURE_NAME);
    // pos.y = pos.y / float(height_TEXTURE_NAME);
    // 解决40w大数据坐标混乱问题，先用int计算，之后再用float计算
    int z = int(mod(float(n), 4.0));
    n -= z;
    int y = n / (4 * width_TEXTURE_NAME);
    n -= y * 4 * width_TEXTURE_NAME;
    int x = n / 4;
    pos.x = float(x) / float(width_TEXTURE_NAME);
    pos.y = float(y) / float(height_TEXTURE_NAME);
    pos.z = float(z);
    return pos;
}
`;
