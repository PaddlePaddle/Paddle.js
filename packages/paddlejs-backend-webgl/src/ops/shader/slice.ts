/**
 * @file slice
 * @description slice op，目前 case 很单一，暂时仅支持遇到的 case：slice final dim
 * @example x = [[1,2,3,4],[5,6,7,8]] axes=[1] starts=[2] ends=[3] => out [3,7]
 */

import { genGLSLArr, ArrTypeEnum, getValueFromArrByIndex } from '../../utils/dataProcess';


function mainFunc(
    {
        out, origin
    },
    {
        axes,
        starts,
        ends,
        decrease_axis
    }
) {

    if (
        axes.length > 1
        || starts.length > 1
        || ends.length > 1
        || (decrease_axis && decrease_axis.length === 0)
    ) {
        throw Error('[slice op feature]: current support one dim, support decrease_axis');
    }
    const {
        width_shape,
        height_shape,
        channel,
        total_shape,
        length_unformatted_shape
    } = origin;
    const batch = total_shape / (width_shape * height_shape * channel);
    const tensor_shape = [batch, channel, height_shape, width_shape];

    let axis = axes[0];

    if (axis < 0) {
        axis = axis + length_unformatted_shape + 1;
    }
    axis = 4 - length_unformatted_shape + axis;

    if (axis !== 4) {
        throw Error('[slice op feature]: unsupport axis value');
    }

    const start = starts[0];
    const end = ends[0];

    const [
        batch_num,
        channel_num,
        height_num,
        width_num
    ] = tensor_shape;

    // 计算 output tensor value 对应的 origin index
    const res_pos = [];
    for (let index = start; index < end; index++) {
        for (let batch = 0; batch < batch_num; batch++) {
            for (let channel = 0; channel < channel_num; channel++) {
                for (let height = 0; height < height_num; height++) {
                    res_pos.push(
                        batch * channel_num * height_num * width_num
                        + channel * height_num * width_num
                        + height * width_num + index
                    );
                }
            }
        }
    }

    const glslIndexArr = genGLSLArr(res_pos, 'arr', ArrTypeEnum.INT_TYPE);

    const getValueFromArrByIndexGLSL = getValueFromArrByIndex(res_pos, 'arr', ArrTypeEnum.INT_TYPE);

    return `
    ${getValueFromArrByIndexGLSL}

    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        ${glslIndexArr}

        // 输出坐标转换为输入坐标
        int sumVal = oPos.a
            + oPos.b * ${out.width_shape}
            + oPos.g * ${out.height_shape} * ${out.width_shape}
            + oPos.r * ${out.channel} * ${out.width_shape} * ${out.height_shape};

        int index = getValueFromArrByIndex_arr(arr, sumVal);

        float res = 0.0;
        ivec4 co = getTensorPosFromArrayIndex_origin(index);
        res = getValueFromTensorPos_origin(co.r, co.g, co.b, co.a);
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos', 'getTensorPosFromArrayIndex']
    }
};
