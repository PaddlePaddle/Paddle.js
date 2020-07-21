/* eslint-disable */
/**
 * @file 主函数
 * @author zhangjingyuan02
 */
export default `
    // start函数
    void main(void) {
        float res = 0.0;
        ivec4 out_pos = getOutputTensorPosLIMIT_OUT();
        float bias = getValueFromTensorPosLIMIT_BIAS_bias(out_pos.r, out_pos.g, out_pos.b, out_pos.a);

        for (int j = 0; j < width_shape_origin; j++) {
            float w = getValueFromTensorPosLIMIT_WEIGHT_weight(out_pos[0], out_pos[1], j, out_pos[3]);
            float o = getValueFromTensorPosLIMIT_ORIGIN_origin(out_pos[0], out_pos[1], out_pos[2], j);
            res += w * o;
        }

        res = res + bias;
        setOutput(res);
    }
`;
