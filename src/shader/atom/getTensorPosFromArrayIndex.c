// TENSOR_NAME, tensor name
// 获取数组元素索引为N的元素，在tensor上的坐标ivec3(width, height, channel)

ivec3 getTensorPosFromArrayIndex_TENSOR_NAME(int n) {
    ivec3 pos;
    pos.z = int(mod(float(n), float(channel_TENSOR_NAME)));
    pos.x = int(floor(mod(float(n) / float(channel_TENSOR_NAME), float(width_shape_TENSOR_NAME))));
    pos.y = int(floor(float(n) / float(channel_TENSOR_NAME * width_shape_TENSOR_NAME)));
    return pos;
}
