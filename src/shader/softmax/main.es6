/* eslint-disable */
/**
 * @file softmax主函数
 * @author yangmingming
 */
export default `
// start函数
void main(void) {
    ivec4 oPos = getOutputTensorPos();
    const int n = int(total_shape_origin/channel_origin/height_shape_origin/width_shape_origin);
    float o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], oPos[3]);
    // 输出坐标转换为输入坐标
    float total = 0.0;
    float res = 0.0;
    if (axis == 0) {
        for (int i = 0; i < n; i++){
        float temp = getValueFromTensorPos_origin(i, oPos[1], oPos[2], oPos[3]);
        total += exp(temp);
        }
        res = exp(o) / total;
    }
    else if (axis == 1) {
        for (int i = 0; i < channel_origin; i++){
        float temp = getValueFromTensorPos_origin(oPos[0], i, oPos[2], oPos[3]);
        total += exp(temp);
        }
        res = exp(o) / total;
    }
    else if (axis == 2) {
        for (int i = 0; i < height_shape_origin; i++){
        float temp = getValueFromTensorPos_origin(oPos[0], oPos[1], i, oPos[3]);
        total += exp(temp);
        }
        res = exp(o) / total;
    }
    else {
        for (int i = 0; i < width_shape_origin; i++){
        float temp = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], i);
        total += exp(temp);
        }
        res = exp(o) / total;
    }
    setOutput(res);
}
`;
