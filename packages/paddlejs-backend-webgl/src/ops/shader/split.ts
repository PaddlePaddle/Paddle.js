/**
 * @file split
 */

function mainFunc(
    {},
    { target_length, num, dim }
) {
    return `
    // start函数
    void main(void) {
        int length = int(${target_length} / ${num});
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        oPos[${dim}] = oPos[${dim}] + layer_run_time * length;
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        setOutput(float(o));
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
