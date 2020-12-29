/**
 * @file split
 */

function mainFunc(
    { out },
    { target_length, num, dim }
) {
    return `
    // start函数
    void main(void) {
        int length = int(${target_length} / ${num});
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        //int sumVal = oPos.g
            + oPos.a * ${out.channel}
            + oPos.b * ${out.channel} * ${out.width_shape}
            + oPos.r * ${out.channel} * ${out.width_shape} * ${out.height_shape};

        oPos[${dim}] = oPos[${dim}] + layer_run_time * length;
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'target_length',
        'num',
        'dim'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'normalizeDim'
    ]
}; ;
