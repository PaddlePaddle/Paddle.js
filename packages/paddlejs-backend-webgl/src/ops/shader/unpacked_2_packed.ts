/**
 * @file unpacked 2 packed
 */

function mainFunc(
    {},
    {}
) {
    return `
    // start函数
    void main() {
        ivec4 oPos = getOutputTensorPos();
        vec4 out4;
        for (int i = 0; i < 4; i++) {
            vec4 o = getValueFromTensorPosPacking_origin(oPos[0], oPos[1] * 4 + i, oPos[2], oPos[3]);
            out4[i] = o[0];
        }
        setPackedOutput(out4);
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
