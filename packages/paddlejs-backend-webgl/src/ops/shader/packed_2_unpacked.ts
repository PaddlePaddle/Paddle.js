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
        float res = 0.0;
        int c1 = int(mod(float(oPos[1]), 4.0));
        vec4 o = getValueFromTensorPosPacking_origin(oPos[0], oPos[1] / 4, oPos[2], oPos[3]);

        if (c1 == 0) {
            res = o.r;
        } else if (c1 == 1) {
            res = o.g;
        } else if (c1 == 2) {
            res = o.b;
        } else if (c1 == 3) {
            res = o.a;
        }
        setOutput(res);
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
