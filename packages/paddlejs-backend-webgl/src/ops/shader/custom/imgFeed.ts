/**
 * @file feed post process
 */

function mainFunc(
    {},
    {}
) {

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        vec4 o = getValueFromTensorPosPacking_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        setPackedOutput(o / 255.0);
    }
    `;
}
export default {
    mainFunc,
    params: [],
    textureFuncConf: {
        origin: ['getValueFromTensorPosPacking']
    }
};
