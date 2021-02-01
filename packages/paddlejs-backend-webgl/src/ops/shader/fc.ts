/**
 * @file fc
 */

function mainFunc(
    { origin },
    {}
) {
    return `
    // start函数
    void main(void) {
        float res = 0.0;
        ivec4 out_pos = getOutputTensorPos();
        float bias = getValueFromTensorPos_bias(out_pos.r, out_pos.g, out_pos.b, out_pos.a);

        for (int j = 0; j < ${origin.width_shape}; j++) {
            float w = getValueFromTensorPos_weight(out_pos[0], out_pos[1], j, out_pos[3]);
            float o = getValueFromTensorPos_origin(out_pos[0], out_pos[1], out_pos[2], j);
            res += w * o;
        }

        res = res + bias;
        setOutput(res);
    }
`;
}
export default {
    mainFunc,
    params: [
    ],
    textureFuncConf: {
        weight: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos'],
        bias: ['getValueFromTensorPos']
    },
    behaviors: [
        'flattenShape'
    ]
};
