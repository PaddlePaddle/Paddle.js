
/**
 * @file dropout
 */

function mainFunc(
    {},
    { dropout_implementation, dropout_prob }
) {

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;
        o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        if (${dropout_implementation === 'downgrade_in_infer'}) {
            o = o * (1.0 - float(${dropout_prob}));
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
