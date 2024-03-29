
/**
 * @file reduce_mean
 */

function mainFunc(
    {},
    { inputs_dim, dim }
) {
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;
        for (int i = 0; i < ${inputs_dim}; i++) {
            oPos[${dim}] = i;
            o += getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        }
        o = o / float(${inputs_dim});
        setOutput(o);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'normalizeDim'
    ]
};
