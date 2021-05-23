/**
 * @file shuffle_channel
 * @description reshape2 transpose2 reshape2
 */


function mainFunc(
    {
        out
    },
    {
        group = 2
    }
) {
    const { total_shape, height_shape, width_shape, channel } = out;
    const channels_per_group = channel / group;

    const [
        perm_0,
        perm_1,
        perm_2,
        perm_3
    ] = [1, 0, 2, 3];

    return `
    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;

        int sumVal = oPos.a
            + oPos.b * ${width_shape}
            + oPos.g * ${height_shape} * ${width_shape}
            + oPos.r * ${channel} * ${width_shape} * ${height_shape};

        ivec4 transpose_out_pos = transferFromNHWCtoNCHW(
            sumVal,
            ${group},
            ${width_shape},
            ${height_shape},
            ${total_shape}
        );

        ivec4 transpose_in_pos = ivec4(transpose_out_pos[${perm_0}],
            transpose_out_pos[${perm_1}], transpose_out_pos[${perm_2}], transpose_out_pos[${perm_3}]);
        int sumVal2 = transpose_in_pos.a
            + transpose_in_pos.b * ${width_shape}
            + transpose_in_pos.g * ${height_shape} * ${width_shape}
            + transpose_in_pos.r * ${channels_per_group} * ${width_shape} * ${height_shape};
        ivec4 origin_oPos = transferFromNHWCtoNCHW(
            sumVal2,
            ${channel},
            ${width_shape},
            ${height_shape},
            ${total_shape}
        );


        o = getValueFromTensorPos_origin(
            origin_oPos[0],
            origin_oPos[1],
            origin_oPos[2],
            origin_oPos[3]
        );

        setOutput(float(o));
    }
    `;
}

export default {
    mainFunc,
    params: [
        'group'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    commonFuncConf: ['transferFromNHWCtoNCHW']
};
