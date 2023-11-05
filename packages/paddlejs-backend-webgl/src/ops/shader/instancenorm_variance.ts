/**
 * @file batchnorm
 */

function mainFunc(
    { origin },
    { epsilon }
) {
    const { height_shape, width_shape } = origin;

    return `

    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();

        float variance = 0.0;
        float sum = 0.0;
        for (int i = 0; i < ${height_shape}; i++) {
            float inner = 0.0;
            for (int j = 0; j < ${width_shape}; j++) {
                float o = getValueFromTensorPos_origin(oPos.b, oPos.a, i, j);
                float m = getValueFromTensorPos_mean(oPos.r, oPos.g, oPos.b,  oPos.a);
                float diff = o - m;
                inner += diff * diff;
            }

            sum += inner / float(${width_shape});
        }
        variance = 1.0 / sqrt(sum / float(${height_shape}) + ${epsilon});

        setOutput(variance);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'epsilon'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        mean: ['getValueFromTensorPos']
    }
};
