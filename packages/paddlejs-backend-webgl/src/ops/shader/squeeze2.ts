/**
 * @file squeeze2
 */

function mainFunc(
    { origin, out },
    { axes }
) {
    const length_unformatted_shape = origin.length_unformatted_shape;
    const out_unformatted_shape = out.length_unformatted_shape;
    const axesArr = Array.isArray(axes) ? axes : [axes];
    const diffNum = 4 - length_unformatted_shape;
    const newAxes = axesArr.map(item => item === -1 ? 3 : (item + diffNum));

    // 获取output的维度
    // const posArr = [0, 1, 2, 3].filter(item => item >= axesArr.length);
    const posArr = ['oPos.r', 'oPos.g', 'oPos.b', 'oPos.a'].slice(-1 * out_unformatted_shape);
    const dest = [0, 1, 2, 3];
    Array.from(newAxes, axis => dest.splice(axis, 1, -1));
    const newPosArr = dest.reverse().map(item => {
        if (item === -1) {
            return '0';
        }
        return posArr.pop() || '0';
    }).reverse();

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
