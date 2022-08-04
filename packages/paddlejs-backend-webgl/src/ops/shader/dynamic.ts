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
    exp: ['transToExp'],
    sqrt: ['transToSqrt'],
    tanh: ['transToTanh'],
    abs: ['transToAbs']
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
        textureFuncConf: {
            origin: ['getPixelsFromTexturePos']
        },
        behaviors: commonFuncBehaviors[funcName]
    };

};
