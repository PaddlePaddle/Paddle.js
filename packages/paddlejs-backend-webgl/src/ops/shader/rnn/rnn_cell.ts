/**
 * @file rnn_cell
 */

function mainFunc(
    {},
    {
        state_axis
    }
) {
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float origin = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        float cell = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a + 48);
        float appender = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a + 96);
        float fourth = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a + 144);
        float counter  = getValueFromTensorPos_counter(oPos.r, ${state_axis}, oPos.b, oPos.a);
        float i = 1.0 / (1.0 + exp(-origin));
        float f = 1.0 / (1.0 + exp(-cell));
        float c = f * counter + i * tanh(appender);
        
        setOutput(c);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'state_axis'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        counter: ['getValueFromTensorPos']
    }
};
