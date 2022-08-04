/**
 * @file slice
 * @description slice op，目前 case 很单一，暂时仅支持遇到的 case：slice final dim
 * @example x = [[1,2,3,4],[5,6,7,8]] axes=[1] starts=[2] ends=[3] => out [3,7]
 */

function mainFunc(
    {
        origin
    },
    {
        starts,
        axes
    }
) {
    const {
        length_unformatted_shape,
        width_shape,
        height_shape,
        channel
    } = origin;

    const axisList = Array.isArray(axes) ? axes : [axes];
    if (axisList.length !== 1) {
        throw Error('[slice op feature]: axes only support one dim');
    }
    let axis = axisList[0];
    axis = axis === -1 ? 3 : (4 - length_unformatted_shape + axis);

    // const curDim = tensor_shape[axis];
    const originPos = ['(oPos[0])', '(oPos[1])', '(oPos[2])', '(oPos[3])'];
    originPos[axis] = `(oPos[${axis}]+ start)`;
    const start = starts[0];

    return `
    void main(void) {
        int start = ${start};
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        int sumVal = ${originPos[3]}
            + ${originPos[2]} * ${width_shape}
            + ${originPos[1]} * ${height_shape * width_shape}
            + ${originPos[0]} * ${channel * width_shape * height_shape};

        float res = 0.0;
        ivec4 co = getTensorPosFromArrayIndex_origin(sumVal);
        res = getValueFromTensorPos_origin(co.r, co.g, co.b, co.a);
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getTensorPosFromArrayIndex', 'getValueFromTensorPos']
    }
};
