
/**
 * @file pad3d
 */

function recoverShape({ total_shape, channel, height_shape, width_shape }) {
    return [total_shape / channel / height_shape / width_shape, channel, height_shape, width_shape];
}

function mainFunc(
    { origin },
    { paddings, mode, value }
) {
    const originShape = recoverShape(origin);
    const modes = {
        reflect: `
            int a;
            int b;
            if (oPos.a - ${paddings[0]} < 0) {
                a = ${paddings[0]} - oPos.a;
            }
            else if (oPos.a - ${paddings[0]} >= ${originShape[3]}) {
                a = ${originShape[3]} - (oPos.a - ${paddings[0]} - ${originShape[3]} + 1) - 1;
            }
            else {
                a = oPos.a - ${paddings[0]};
            }
            if (oPos.b - ${paddings[2]} < 0) {
                b = ${paddings[2]} - oPos.b;
            }
            else if (oPos.b - ${paddings[2]} >= ${originShape[2]}) {
                b = ${originShape[2]} - (oPos.b - ${paddings[2]} - ${originShape[2]} + 1) - 1;
            }
            else {
                b = oPos.b - ${paddings[2]};
            }
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
        `,
        replicate: `
            int a;
            int b;
            if (oPos.a - ${paddings[0]} < 0) {
                a = 0;
            }
            else if (oPos.a - ${paddings[0]} >= ${originShape[3]}) {
                a = ${originShape[3]} - 1;
            }
            else {
                a = oPos.a - ${paddings[0]};
            }
            if (oPos.b - ${paddings[2]} < 0) {
                b = 0;
            }
            else if (oPos.b - ${paddings[2]} >= ${originShape[2]}) {
                b = ${originShape[2]} - 1;
            }
            else {
                b = oPos.b - ${paddings[2]};
            }
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
        `,
        circular: `
            int a;
            int b;
            if (oPos.a - ${paddings[0]} < 0) {
                a = int(mod(float(${paddings[0]} + oPos.a - 1), float(${originShape[3]})));
            }
            else if (oPos.a - ${paddings[0]} >= ${originShape[3]}) {
                a = int(mod(float(oPos.a - ${paddings[0]} - ${originShape[3]}), float(${originShape[3]})));
            }
            else {
                a = oPos.a - ${paddings[0]};
            }
            if (oPos.b - ${paddings[2]} < 0) {
                b = int(mod(float(${paddings[2]} + oPos.b - 1), float(${originShape[2]})));
            }
            else if (oPos.b - ${paddings[2]} >= ${originShape[2]}) {
                b = int(mod(float(oPos.b - ${paddings[2]} - ${originShape[2]}), float(${originShape[2]})));
            }
            else {
                b = oPos.b - ${paddings[2]};
            }
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, b, a);
        `,
        constant: '',
        undefined: ''
    };
    const defaultValue = value ? value : '0.0';

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float o = ${defaultValue};
        if (oPos.a - ${paddings[0]} >= 0
            && oPos.b - ${paddings[2]} >= 0
            && oPos.a - ${paddings[0]} < ${originShape[3]}
            && oPos.b - ${paddings[2]} < ${originShape[2]}
        ) {
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b - ${paddings[2]}, oPos.a - ${paddings[0]});
        }
        else {
            ${modes[mode]}
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'paddings',
        'mode',
        'value'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
