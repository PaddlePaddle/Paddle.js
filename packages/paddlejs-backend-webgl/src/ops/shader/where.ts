
/**
 * @file where return condition ? x : y
 */

function mainFunc(
    {},
    {}
) {
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float x = getValueFromTensorPos_input(oPos.r, oPos.g, oPos.b, oPos.a);
        float y = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
        float condition = getValueFromTensorPos_condition(oPos.r, oPos.g, oPos.b, oPos.a);
        float o = 0.0;

        if (bool(condition)) {
            o = x;
        }
        else {
            o = y;
        }
        setOutput(o);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        counter: ['getValueFromTensorPos'],
        condition: ['getValueFromTensorPos']
    }
};
