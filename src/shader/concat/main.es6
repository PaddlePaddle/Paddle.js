/* eslint-disable */
/**
 * @file concat主函数
 * @author zhangjingyuan02
 */
export default `
// start函数，目前支持 2维 tensor
void main(void) {
    float res = 0.0;
    // 获取output的坐标
    ivec4 out_pos = getOutputTensorPos();
    // 是否 按 列 相接
    bool baseCol = axis == 1 || axis == -1;
    int transformedHeight = baseCol ? height_shape_origin : height_shape_origin + height_shape_counter;
    int transformedWidth = baseCol ? width_shape_origin + width_shape_counter : width_shape_origin;

    for (int w = 0; w < transformedWidth; w++) {
        for (int h = 0; h < transformedHeight; h++) {
            if (out_pos[2] == h && out_pos[3] == w) {
                if (baseCol) {
                    if (w < width_shape_origin) {
                        res = getValueFromTensorPos_origin(out_pos[0], out_pos[1], h, w);
                    }
                    else {
                        res = getValueFromTensorPos_counter(out_pos[0], out_pos[1], h, w - width_shape_origin);
                    }
                }
                else {
                    if (h < height_shape_origin) {
                        res = getValueFromTensorPos_origin(out_pos[0], out_pos[1], h, w);
                    }
                    else {
                        res = getValueFromTensorPos_counter(out_pos[0], out_pos[1], h - height_shape_origin, w);
                    }
                }

            }
        }
    }
    setOutput(res);
}
`;
