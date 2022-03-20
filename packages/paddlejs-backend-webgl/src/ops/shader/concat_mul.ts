/**
 * @file concat_mul dynamic inputs
 * @description concat inputs X supports no more than 15 tensors, eg. [a1, a2, a3, a4, ... , a15]
 */

/* eslint-disable max-lines */
function mainFunc(
    tensors,
    { dim }
) {
    const inputTensorsKey = Object.keys(tensors).filter(item => item !== 'out');
    const inputTensors = inputTensorsKey.map(key => tensors[key]);
    const inputTensorDimShape = inputTensors.map(item => {
        const {
            width_shape,
            height_shape,
            channel,
            total_shape
        } = item;
        const batch = total_shape / (width_shape * height_shape * channel);
        const shape = [batch, channel, height_shape, width_shape];
        return shape[dim];
    });
    const inputsDimAccShape = inputTensorDimShape.map((_, index) => {
        return inputTensorDimShape.slice(0, index + 1).reduce((acc, cur) => acc + cur, 0);
    });

    let getValueFromTensorPosCode = '';
    inputsDimAccShape.forEach((shape, index) => {
        if (index === 0) {
            getValueFromTensorPosCode += `
            if (oPos[${dim}] < ${shape}) {
                o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
            }`;
        }
        else {
            getValueFromTensorPosCode += `
            else if (oPos[${dim}] < ${shape}) {
                oPos[${dim}] = oPos[${dim}] - ${inputsDimAccShape[index - 1]};
                o = getValueFromTensorPos_origin_${index}(oPos.r, oPos.g, oPos.b, oPos.a);
            }
            `;
        }
    });

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;
        ${getValueFromTensorPosCode}
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        '@all': ['getValueFromTensorPos']
    },
    behaviors: [
        'normalizeDim'
    ]
};
