/**
 * @file squeeze2
 */

function mainFunc(
    {},
    { axes }
) {
    const axesArr = Array.isArray(axes) ? axes : [axes];
    // 获取output的维度
    const posArr = [0, 1, 2, 3].filter(item => item >= axesArr.length);
    const newPosArr = [0, 1, 2, 3].map(item => {
        if (axesArr.indexOf(item) > -1) {
            return 0;
        }
        const nowIndex = posArr.splice(0, 1);
        return `oPos[${nowIndex}]`;
    });
    const posStr = newPosArr.join(',');

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;
        o = getValueFromTensorPos_origin(${posStr});
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
