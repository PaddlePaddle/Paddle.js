/**
 * @file  mul
 */

function mainFunc(
    { origin },
    {}
) {
    return `
    // start函数
    void main(void) {
        float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        for (int j = 0; j < ${origin.width_shape}; j++) {
            float c = getValueFromTensorPos_counter(out_pos[0], out_pos[1], j, out_pos[3]);
            float o = getValueFromTensorPos_origin(out_pos[0], out_pos[1], out_pos[2], j);
            res += c * o;
        }
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
    ],
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'reshape'
    ]
};
