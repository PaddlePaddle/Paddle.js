/**
 * @file batchnorm
 */

function mainFunc(
    { origin },
    {}
) {
    const { height_shape, width_shape } = origin;

    return `

    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = 0.0;
        for (int i = 0; i < ${height_shape}; i++) {
            float inner = 0.0;
            for (int j = 0; j < ${width_shape}; j++) {
                inner += getValueFromTensorPos_origin(oPos.b, oPos.a, i, j);
            }

            o += (inner / float(${width_shape}));
        }

        o = o / float(${height_shape});
        setOutput(o);
    }
    `;
}
export default {
    mainFunc,
    params: [
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
