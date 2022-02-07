/**
 * @file feed post process
 */

function mainFunc(
    { out },
    { mean = [0, 0, 0], std = [1, 1, 1] }
) {
    const { total_shape, height_shape, width_shape, channel } = out;
    return `
    // start函数
    void main(void) {
        ivec4 nhwcPos = getOutputTensorPos();
        int sumVal = nhwcPos.a
            + nhwcPos.b * ${width_shape}
            + nhwcPos.g * ${height_shape} * ${width_shape}
            + nhwcPos.r * ${channel} * ${width_shape} * ${height_shape};

        ivec4 oPos = transferFromNHWCtoNCHW(
            sumVal,
            ${channel},
            ${width_shape},
            ${height_shape},
            ${total_shape}
        );
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
    textureFuncConf: {
        origin: ['getValueFromTensorPosPacking']
    },
    commonFuncConf: ['transferFromNHWCtoNCHW']
};
