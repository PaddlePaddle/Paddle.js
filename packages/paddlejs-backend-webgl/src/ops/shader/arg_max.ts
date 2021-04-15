/**
 * @file arg_max
 */

function mainFunc(
    { origin },
    {
        axis = -1,
        flatten
    }
) {
    const { total_shape, height_shape, width_shape, channel, length_unformatted_shape } = origin;
    const batch_shape = total_shape / (width_shape * height_shape * channel);
    const shape = [batch_shape, channel, height_shape, width_shape];

    const real_axis = axis < 0 ? 3 : 4 - length_unformatted_shape + axis;
    const axis_shape = shape[real_axis];

    return `

    void main() {
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;
        int pos = 0;
        if (${!flatten}) {
            if (${real_axis} == 1) {
                float tmp = getValueFromTensorPos_origin(oPos.g, 0, oPos.b, oPos.a);
                for (int index = 0; index < ${axis_shape}; index++) {
                    o = getValueFromTensorPos_origin(oPos.g, index, oPos.b, oPos.a);
                    if (o > tmp) {
                        tmp = o;
                        pos = index;
                    }
                }
            }
            else if (${real_axis} == 2) {
                float tmp = getValueFromTensorPos_origin(oPos.g, oPos.b, 0, oPos.a);
                for (int index = 0; index < ${axis_shape}; index++) {
                    o = getValueFromTensorPos_origin(oPos.g, oPos.b, index, oPos.a);
                    if (o > tmp) {
                        tmp = o;
                        pos = index;
                    }
                }
            }
            else if (${real_axis} == 3) {
                float tmp = getValueFromTensorPos_origin(oPos.g, oPos.b, oPos.a, 0);
                for (int index = 0; index < ${axis_shape}; index++) {
                    o = getValueFromTensorPos_origin(oPos.g, oPos.b, oPos.a, index);
                    if (o > tmp) {
                        tmp = o;
                        pos = index;
                    }
                }
            }
            else {
                float tmp = getValueFromTensorPos_origin(0, oPos.g, oPos.b, oPos.a);
                for (int index = 0; index < ${axis_shape}; index++) {
                    o = getValueFromTensorPos_origin(index, oPos.g, oPos.b, oPos.a);
                    if (o > tmp) {
                        tmp = o;
                        pos = index;
                    }
                }
            }
        }
        else {
            int index = 0;
            float tmp = getValueFromTensorPos_origin(0, 0, 0, 0);
            for (int n = 0; n < ${batch_shape}; n++) {
                for (int c = 0; c < ${channel}; c++) {
                    for (int h = 0; h < ${height_shape}; h++) {
                        for (int w = 0; w < ${width_shape}; w++) {
                            o = getValueFromTensorPos_origin(n, c, h, w);
                            if (o > tmp) {
                                tmp = o;
                                pos = index;
                            }
                            index++;
                        }
                    }
                }
            }
        }
        setOutput(float(pos));
    }`;
}
export default {
    mainFunc,
    params: [
        'axis',
        'flatten'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};

