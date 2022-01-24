/**
 * @file elementwise_pow 逐元素对输入Tensor进行幂操作
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
        float res = pow(float(${Scale_out / Scale_x}) * o, float(${Scale_out / Scale_y}) * c);
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'processAxis',
        'genElementwiseCounterPos'
    ]
};
