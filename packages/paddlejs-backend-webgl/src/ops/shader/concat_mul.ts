/**
 * @file concat_mul
 * @description concat inputs X supports no more than 4 tensors, eg. [a1, a2, a3, a4]
 */

/* eslint-disable max-lines */
function mainFunc(
    {},
    { dim, inputs_dim, counter_num, append_num, fourth_num = 0, fourInputs = false }
) {
    const counter_total = inputs_dim + counter_num;
    const append_total = inputs_dim + counter_num + append_num;
    const z_total = inputs_dim + counter_num + append_num + fourth_num;
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;

        if (oPos[${dim}] < ${inputs_dim}) {
            o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        }
        else if (oPos[${dim}] < ${counter_total}) {
            oPos[${dim}] = oPos[${dim}] - ${inputs_dim};
            o = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
        }
        else if (oPos[${dim}] < ${append_total}) {
            oPos[${dim}] = oPos[${dim}] - ${counter_total};
            o = getValueFromTensorPos_appender(oPos.r, oPos.g, oPos.b, oPos.a);
        }
        else {
            ${fourInputs
        ? `
            if (oPos[${dim}] < ${z_total}) {
                oPos[${dim}] = oPos[${dim}] - ${append_total};
                o = getValueFromTensorPos_fourth(oPos.r, oPos.g, oPos.b, oPos.a);
            }
        `
        : ''}
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'dim',
        'inputs_dim',
        'counter_num',
        'append_num',
        'fourInputs',
        'fourth_num'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        counter: ['getValueFromTensorPos'],
        appender: ['getValueFromTensorPos'],
        fourth: ['getValueFromTensorPos']
    },
    behaviors: [
        'normalizeDim'
    ]
};
