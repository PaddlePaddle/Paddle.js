/* eslint-disable */
/**
 * @file mul主函数
 */
export default `
// start函数
void main(void) {
    float res = 0.0;
    // 获取output的坐标
<<<<<<< HEAD
    ivec4 out_pos = getOutputTensorPosLIMIT_OUT();
    for (int j = 0; j < width_shape_origin; j++) {
        float c = getValueFromTensorPosLIMIT_COUNTER_counter(out_pos[0], out_pos[1], j, out_pos[3]);
        float o = getValueFromTensorPosLIMIT_COUNTER_origin(out_pos[0], out_pos[1], out_pos[2], j);
=======
    ivec4 out_pos = getOutputTensorPos();
    for (int j = 0; j < width_shape_origin; j++) {
        float c = getValueFromTensorPos_counter(out_pos[0], out_pos[1], j, out_pos[3]);
        float o = getValueFromTensorPos_origin(out_pos[0], out_pos[1], out_pos[2], j);
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
        res += c * o;
    }
    setOutput(res);
}
`;
