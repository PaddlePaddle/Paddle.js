/**
 * @file hard_swish
 */

function mainFunc(
    {},
    {
        offset = 3.0,
        scale = 6.0,
        threshold = 6.0
    }
) {
    return `
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        float res = o * min(max(0.0, o + float(${offset})), float(${threshold})) / float(${scale});
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
