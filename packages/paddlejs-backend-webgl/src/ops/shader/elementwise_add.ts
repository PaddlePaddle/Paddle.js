/**
 * @file elementwise_add
 */

function mainFunc(
    {},
    {
        counterPos,
        Scale_y = 1.0,
        Scale_x = 1.0,
        Scale_out = 1.0
    }
) {
    return `
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);

        float c = getValueFromTensorPos_counter(${counterPos});
        float res = float(${Scale_out / Scale_y}) * c + float(${Scale_out / Scale_x}) * o;
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'Scale_y',
        'Scale_x',
        'Scale_out',
        'counterPos'
    ],
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'processAxis',
        'genElementwiseCounterPos'
    ],
    inputsName: [
        'X',
        'Y'
    ]
};
