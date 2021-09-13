/**
 * @file feed post process
 */

function mainFunc(
    {},
    { mean = [0, 0, 0], std = [1, 1, 1] }
) {
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float res = 0.0;
        int c1 = int(mod(float(oPos[1]), 4.0));
        int c = oPos[1];
        vec4 o = getValueFromTensorPosPacking_origin(oPos[0], c / 4, oPos[2], oPos[3]);

        if (c1 == 0) {
            res = o.r;
        } else if (c1 == 1) {
            res = o.g;
        } else if (c1 == 2) {
            res = o.b;
        } else if (c1 == 3) {
            res = o.a;
        }

        if (c == 0) {
            res = (res - float(${mean[0]})) / float(${std[0]});
        } else if (c == 1) {
            res = (res - float(${mean[1]})) / float(${std[1]});
        } else if (c == 2) {
            res = (res - float(${mean[2]})) / float(${std[2]});
        }
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'mean',
        'std'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPosPacking']
    }
};
