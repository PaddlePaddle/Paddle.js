/**
 * @file pool2d_max
 */

function mainFunc(
    { origin },
    { strides = [], paddings = [], ksize }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const [ksize_x, ksize_y] = ksize;
    return `
    // start函数
    void main(void) {
        float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        int b = out_pos[0];
        int c = out_pos[1];
        int y = out_pos[2];
        int x = out_pos[3];
        // X、Y方向的移动步长
        int oy_base = out_pos[2] * ${stride_v} - ${padTop};
        int ox_base = out_pos[3] * ${stride_h} - ${padLeft};
        for (int fy = 0; fy < ${ksize_y}; fy++) {
            int oy = oy_base + fy;
            if (oy >= ${origin.height_shape}) {
                break;
            }
            if (oy < 0) {
                continue;
            }
            for (int fx = 0; fx < ${ksize_x}; fx++) {
                int ox = ox_base + fx;
                if (ox >= ${origin.width_shape}) {
                    break;
                }
                if (ox < 0) {
                    continue;
                }
                // origin数据
                float curr = getValueFromTensorPos_origin(out_pos[0], out_pos[1], oy, ox);
                res = max(res, curr);
            }
        }
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'strides',
        'paddings',
        'ksize'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'isMax',
        'setPacked',
        'isGlobalPooling'
    ]
}; ;
