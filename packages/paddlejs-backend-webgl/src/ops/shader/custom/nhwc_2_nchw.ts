/**
 * @file fetch
 */

function mainFunc(
    { origin, out },
    {}
) {
    return `
    void main() {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        int sumVal = oPos.a * ${out.channel}
            + oPos.b * ${out.width_shape} * ${out.channel}
            + oPos.g
            + oPos.r * ${out.channel} * ${out.width_shape} * ${out.height_shape};
        ivec4 new_oPos = transferFromNHWCtoNCHW(
            sumVal,
            ${origin.channel},
            ${origin.width_shape},
            ${origin.height_shape},
            ${origin.total_shape}
        );
        float o = getValueFromTensorPos_origin(new_oPos.r, new_oPos.g, new_oPos.b, new_oPos.a);
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    commonFuncConf: ['transferFromNHWCtoNCHW']
};
