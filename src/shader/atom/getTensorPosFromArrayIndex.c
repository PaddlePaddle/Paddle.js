// TENSOR_NAME, tensor name
// 获取数组元素索引为N的元素，在tensor上的坐标ivec4(batch, channel, height, width)

iTENSOR_TYPE getTensorPosFromArrayIndex_TENSOR_NAME(int n) {
    iTENSOR_TYPE pos;
    pos[0] = int(floor(float(n / numbers_shape_TENSOR_NAME[0])));
    int number = pos[0] * numbers_shape_TENSOR_NAME[0];
    for (int i = 1; i < length_shape_TENSOR_NAME; i++) {
        pos[i] = int(floor(float((n - number) / numbers_shape_TENSOR_NAME[i])));
        number += pos[i] * numbers_shape_TENSOR_NAME[i];
    }
    return pos;
}
