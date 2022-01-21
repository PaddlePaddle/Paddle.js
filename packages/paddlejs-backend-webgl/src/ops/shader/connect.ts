
/**
 * @file connect dynamic inputs
 */

import { reduceShape } from '../../utils/dataProcess';

function mainFunc(
    tensors,
    {}
) {
    const { total_shape, width_shape, height_shape, channel } = tensors.out;
    const reducedShape = reduceShape([
        total_shape / (width_shape * height_shape * channel),
        channel,
        height_shape,
        width_shape
    ]); // [chw, hw, w]

    const inputTensorsKey = Object.keys(tensors).filter(item => item !== 'out');
    const inputTensorsTotalShape = inputTensorsKey.map(key => tensors[key].total_shape);

    const inputsAccTotalShape = inputTensorsTotalShape.map((_, index) => {
        return inputTensorsTotalShape.slice(0, index + 1).reduce((acc, cur) => acc + cur, 0);
    });

    let getValueFromTensorPosCode = '';
    inputsAccTotalShape.forEach((total, index) => {
        if (index === 0) {
            getValueFromTensorPosCode += `
            if (sumVal < ${total}) {
                co = getTensorPosFromArrayIndex_origin(sumVal);
                o = getValueFromTensorPos_origin(co.r, co.g, co.b, co.a);
            }`;
        }
        else {
            getValueFromTensorPosCode += `
            else if (sumVal < ${total}) {
                co = getTensorPosFromArrayIndex_origin_${index}(sumVal - ${inputsAccTotalShape[index - 1]});
                o = getValueFromTensorPos_origin_${index}(co.r, co.g, co.b, co.a);
            }
            `;
        }
    });

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;
        ivec4 co;
        int sumVal = oPos.b * ${reducedShape[2]} + oPos.a;
        ${getValueFromTensorPosCode}
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        '@all': ['getValueFromTensorPos', 'getTensorPosFromArrayIndex']
    }
};
