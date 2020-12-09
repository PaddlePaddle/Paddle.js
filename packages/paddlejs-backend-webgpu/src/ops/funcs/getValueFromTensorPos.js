/**
 * @file getValueFromTensorPos
 * @desc 根据tensor坐标获取这个tensor位置的值
 */
 

export default `
float getValueFromTensorPos_TENSOR_NAME(int r, int g, int b, int a) {
    int sumVal = g + a * channel_TENSOR_NAME + b * channel_TENSOR_NAME * width_shape_TENSOR_NAME + r * channel_TENSOR_NAME * width_shape_TENSOR_NAME * height_shape_TENSOR_NAME;
    ivec4 oPos = transferFromNHWCtoNCHW(sumVal, channel_TENSOR_NAME, width_shape_TENSOR_NAME, height_shape_TENSOR_NAME, total_shape_TENSOR_NAME);
    int NP = channel_TENSOR_NAME * height_shape_TENSOR_NAME * width_shape_TENSOR_NAME;
    int CP = height_shape_TENSOR_NAME * width_shape_TENSOR_NAME;
    int HP = width_shape_TENSOR_NAME;
    int index = oPos.r * NP + oPos.g * CP + oPos.b * HP + oPos.a;
    return float(TENSOR_NAMEMatrix.numbers[index]);
}
`;
