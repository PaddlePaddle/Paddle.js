
/**
 * @file concat
 */

import { reduceShape } from '../../utils/dataProcess';

function mainFunc(
    { origin, out },
    {}
) {
    const { total_shape, width_shape, height_shape, channel } = out;
    const reducedShape = reduceShape([
        total_shape / (width_shape * height_shape * channel),
        channel,
        height_shape,
        width_shape
    ]);
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;
        ivec4 co;
        int sumVal = oPos.b * ${reducedShape[2]} + oPos.a;
        if (sumVal < ${origin.total_shape}) {
            // from origin
            co = getTensorPosFromArrayIndex_origin(sumVal);
            o = getValueFromTensorPos_origin(co.r, co.g, co.b, co.a);

        }
        else {
            // from counter
            co = getTensorPosFromArrayIndex_counter(sumVal - ${origin.total_shape});
            o = getValueFromTensorPos_counter(co.r, co.g, co.b, co.a);
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [],
    textureFuncConf: {
        origin: ['getValueFromTensorPos', 'getTensorPosFromArrayIndex'],
        counter: ['getValueFromTensorPos', 'getTensorPosFromArrayIndex']
    }
};
