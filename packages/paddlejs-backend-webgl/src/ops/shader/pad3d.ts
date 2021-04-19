
/**
 * @file pad3d
 */

function recoverShape({ total_shape, channel, height_shape, width_shape }) {
    return [total_shape / channel / height_shape / width_shape, channel, height_shape, width_shape];
}

function mainFunc(
    { origin },
    { padding, mode, value }
) {
    const originShape = recoverShape(origin);

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float o = ${value ? value : '0.0'};
        if (oPos.a - ${padding[0]} >= 0
            && oPos.b - ${padding[2]} >= 0
            && oPos.a - ${padding[0]} < ${originShape[3]}
            && oPos.b - ${padding[2]} < ${originShape[2]}
        ) {
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b - ${padding[2]}, oPos.a - ${padding[0]});
        }
        else {
            int a = oPos.a - ${padding[0]};
            int b = oPos.b - ${padding[2]};
            if (${mode === 'reflect'}) {
                if (oPos.a - ${padding[0]} < 0) {
                    a = ${padding[0]} - oPos.a;
                }
                else if (oPos.a - ${padding[0]} >= ${originShape[3]}) {
                    a = ${originShape[3]} - (oPos.a - ${padding[0]} - ${originShape[3]} + 1) - 1;
                }
                else {
                    a = oPos.a - ${padding[0]};
                }
                if (oPos.b - ${padding[2]} < 0) {
                    b = ${padding[2]} - oPos.b;
                }
                else if (oPos.b - ${padding[2]} >= ${originShape[2]}) {
                    b = ${originShape[2]} - (oPos.b - ${padding[2]} - ${originShape[2]} + 1) - 1;
                }
                else {
                    b = oPos.b - ${padding[2]};
                }
                o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
            }
            if (${mode === 'replicate'}) {
                if (oPos.a - ${padding[0]} < 0) {
                    a = 0;
                }
                else if (oPos.a - ${padding[0]} >= ${originShape[3]}) {
                    a = ${originShape[3]} - 1;
                }
                else {
                    a = oPos.a - ${padding[0]};
                }
                if (oPos.b - ${padding[2]} < 0) {
                    b = 0;
                }
                else if (oPos.b - ${padding[2]} >= ${originShape[2]}) {
                    b = ${originShape[2]} - 1;
                }
                else {
                    b = oPos.b - ${padding[2]};
                }
                o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
            }
            if (${mode === 'circular'}) {
                if (oPos.a - ${padding[0]} < 0) {
                    a = int(mod(float(${padding[0]} + oPos.a - 1), float(${originShape[3]})));
                }
                else if (oPos.a - ${padding[0]} >= ${originShape[3]}) {
                    a = int(mod(float(oPos.a - ${padding[0]} - ${originShape[3]}), float(${originShape[3]})));
                }
                else {
                    a = oPos.a - ${padding[0]};
                }
                if (oPos.b - ${padding[2]} < 0) {
                    b = int(mod(float(${padding[2]} + oPos.b - 1), float(${originShape[2]})));
                }
                else if (oPos.b - ${padding[2]} >= ${originShape[2]}) {
                    b = int(mod(float(oPos.b - ${padding[2]} - ${originShape[2]}), float(${originShape[2]})));
                }
                else {
                    b = oPos.b - ${padding[2]};
                }
                o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
            }
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'padding',
        'mode',
        'value'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
