/**
 * @file unsqueeze2
 */

function mainFunc(
    {
        origin
    },
    {
        axes
    }
) {
    const {
        length_unformatted_shape
    } = origin;

    const axes_arr = Array.isArray(axes) ? axes : [axes];
    const diffNum = 4 - length_unformatted_shape - axes_arr.length;
    const newAxes = axes_arr.map(item => item + diffNum);

    // 获取 output shape 里原本对应 origin shape 的维度
    const posArr = [0, 1, 2, 3];
    const newPosArr = posArr.filter(item => newAxes.indexOf(item) === -1).map(item => `oPos[${item}]`);
    const prefix = Array.from(new Array(newAxes.length), () => '0');
    newPosArr.splice(0, 0, ...prefix);
    const posStr = newPosArr.join(',');

    return `
    void main() {
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;
        o = getValueFromTensorPos_origin(${posStr});
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'axes'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
