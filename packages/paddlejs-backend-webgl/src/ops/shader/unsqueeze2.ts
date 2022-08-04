/**
 * @file unsqueeze2
 */

function mainFunc(
    {
        out
    },
    {
        axes
    }
) {
    const {
        length_unformatted_shape
    } = out;

    const axes_arr = Array.isArray(axes) ? axes : [axes];
    const newAxes = axes_arr.map(item => item === -1 ? 3 : item);

    // 获取 output shape 里原本对应 origin shape 的维度
    const posArr = [0, 1, 2, 3].slice(4 - length_unformatted_shape);

    for (const axis of newAxes) {
        posArr.splice(axis, 1);
    }

    const prefixArr = Array.from(new Array(4 - posArr.length), () => -1);
    const newPosArr = [...prefixArr, ...posArr];

    const newPosStrArr = [];

    for (let i = 0, len = newPosArr.length; i < len; i++) {
        const v = newPosArr[i];
        const str = v === -1 ? '0' : `oPos[${v}]`;
        newPosStrArr.push(str);
    }

    const posStr = newPosStrArr.join(',');
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
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
