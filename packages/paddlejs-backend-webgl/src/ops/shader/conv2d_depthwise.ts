/**
 * @file conv2d_depthwise
 */

function mainFunc(
    { origin, filter },
    { strides = [], paddings = [], dilations = [], fuse_relu }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const [dilation_v = 1, dilation_h = 1] = dilations;
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        int x = oPos.a;
        int c = oPos.g;
        int y = oPos.b;
        int b = oPos.r;
        float res = 0.0;
        int top = y * ${stride_v} - ${padTop};
        int left = x * ${stride_h} - ${padLeft};
        for (int fy = 0; fy < ${filter.height_shape}; fy++) {
          int oy = top + fy * ${dilation_v};
          if (oy >= ${origin.height_shape}) {
              break;
          }
          if (oy < 0) {
            continue;
          }
          for (int fx = 0; fx < ${filter.width_shape}; fx++) {
            int ox = left + fx * ${dilation_h};
            if (ox >= ${origin.width_shape}) {
                break;
            }
            if (ox < 0) {
                continue;
            }
            // b默认是0
            float f = getValueFromTensorPos_filter(c, 0, fy, fx);
            float o = getValueFromTensorPos_origin(b, c, oy, ox);
            res += f * o;
          }
        }
        float bi = getValueFromTensorPos_bias(0, 0, 0, c);
        res += bi;
        if (${fuse_relu}) {
            res = max(0.0, res);
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
        'dilations',
        'fuse_relu'
    ],
    textureFuncConf: {
        filter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos'],
        bias: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
};
