/**
 * @file conv2d_depthwise_add
 */

function mainFunc(
    { origin, filter, out, counter },
    { active_function, groups = 1, axis, strides = [], paddings = [], dilations = [], multi_value, bias_value }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const [dilation_v = 1, dilation_h = 1] = dilations;
    return `
    // start函数

    float getValueFromCounter(int index) {
        float xPos = float(index) / float(${counter.width_shape});
        vec4 pixels = TEXTURE2D(texture_counter, vec2(xPos, 0.5));
        return pixels.r;
    }
    void main(void) {
        ivec4 oPos = getOutputTensorPos();

        int x = oPos.a;
        int c = oPos.g;
        int y = oPos.b;
        int b = oPos.r;
        int addAxis = oPos[${axis}];
        float res = getValueFromCounter(addAxis);

        // 获取output的坐标
        int oTensorChannel = (c / (${out.channel} / ${groups})) * ${filter.channel};
        int oy = y * ${stride_v} - ${padTop};
        for (int fy = 0; fy < ${filter.height_shape}; fy++) {
            if (oy >= ${origin.height_shape}) {
                break;
            }
            if (oy < 0) {
                oy += ${dilation_v};
                continue;
            }
            int ox = x * ${stride_h} - ${padLeft};
            for (int fx = 0; fx < ${filter.width_shape}; fx++) {
                if (ox >= ${origin.width_shape}) {
                    break;
                }
                if (ox < 0) {
                    ox += ${dilation_h};
                    continue;
                }
                // channel计算
                for (int j = 0; j < ${filter.channel}; j++) {
                    float f = getValueFromTensorPos_filter(c, j, fy, fx);
                    float o = getValueFromTensorPos_origin(b, oTensorChannel + j, oy, ox);
                    res += f * o;
                }
                ox += ${dilation_h};
            }
            oy += ${dilation_v};
        }
        setOutput(${active_function}(res,  ${multi_value},  ${bias_value}));
    }
`;
}
export default {
    mainFunc,
    params: [
        'active_function',
        'groups',
        'axis',
        'strides',
        'paddings',
        'dilations',
        'multi_value',
        'bias_value'
    ],
    textureFuncConf: {
        filter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos'],
        counter: ['getValueFromTensorPos']
    },
    behaviors: [
        'mergeAttrs',
        'checkIsMerge',
        'setActiveFunc'
    ]
};
