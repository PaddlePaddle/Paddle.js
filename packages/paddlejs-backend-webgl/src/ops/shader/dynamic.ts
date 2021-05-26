/**
 * @file dynamic op generated from file of ops/atom/common_func
 */

const commonFuncBehaviors = {
    relu: ['transToPrelu'],
    relu6: ['transToRelu6'],
    leaky_relu: ['transToLeakyrelu'],
    transToLeakyrelu: ['transToLeakyrelu'],
    scale: ['transToScale'],
    sigmoid: ['transToSigmoid'],
    hard_sigmoid: ['transToHardSigmoid'],
    pow: ['transToPow'],
    sqrt: ['transToSqrt'],
    tanh: ['transToTanh']
};

function mainFunc(
    {},
    { multi_value = 1.0, bias_value = 0.0, active_function }
) {
    return `
    // start函数
    void main(void) {
        // 输出数据
        float o = getPixelsFromTexturePos_origin(vCoord).r;
        float res = ${active_function}(o, float(${multi_value}), float(${bias_value}));
        setOutput(res);
    }
    `;
}

export default function (funcName) {
    return {
        mainFunc,
        params: [
            'multi_value',
            'bias_value',
            'active_function'
        ],
        textureFuncConf: {
            origin: ['getPixelsFromTexturePos']
        },
        behaviors: commonFuncBehaviors[funcName]
    };

};
