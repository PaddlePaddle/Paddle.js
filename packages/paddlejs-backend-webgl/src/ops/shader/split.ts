/**
 * @file split
 */

function mainFunc(
    {},
    { target_length, num, dim, sections }
) {

    const splitChip = sections && sections.length > 1 ? sections[0] : target_length / num;

    return `
    // start函数
    void main(void) {
        int length = int(${splitChip});
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
