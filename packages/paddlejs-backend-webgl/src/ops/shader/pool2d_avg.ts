/**
 * @file pool2d_avg
 */

function mainFunc(
    { origin, pool },
    { strides = [], paddings = [] }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    return `
    // start函数
    void main(void) {
        float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        // X、Y方向的移动步长
        int oy_base = out_pos[2] * ${stride_v} - ${padTop};
        int ox_base = out_pos[3] * ${stride_h} - ${padLeft};
        for (int fy = 0; fy < ${pool.height_shape}; fy++) {
            int oy = oy_base + fy;
            if (oy >= ${origin.height_shape}) {
                break;
            }
            if (oy < 0) {
                continue;
            }
            for (int fx = 0; fx < ${pool.width_shape}; fx++) {
                int ox = ox_base + fx;
                if (ox >= ${origin.width_shape}) {
                    break;
                }
                if (ox < 0) {
                    continue;
                }
                // origin数据
                float curr = getValueFromTensorPos_origin(out_pos[0], out_pos[1], oy, ox);
                res += curr;
                // 在平均池化模式忽略填充值(exclusive默认为true）
            }
        }
        res = res / float(${pool.height_shape} * ${pool.width_shape});
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'strides',
        'paddings'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
}; ;