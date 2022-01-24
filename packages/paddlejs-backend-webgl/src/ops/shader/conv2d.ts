/**
 * @file conv2d
 */

/* eslint-disable max-lines-per-function */
function mainFunc(
    { origin, filter, out, bias },
    {
        groups = 1,
        strides = [],
        paddings = [],
        dilations = [],
        fuse_relu,
        filter_nearest_vec4,
        filter_remainder_vec4,
        act_type
    }
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
                for (int j = 0; j < ${filter_nearest_vec4}; j += 4) {
                    vec4 fValues = vec4(
                        getValueFromTensorPos_filter(c, j, fy, fx),
                        getValueFromTensorPos_filter(c, j + 1, fy, fx),
                        getValueFromTensorPos_filter(c, j + 2, fy, fx),
                        getValueFromTensorPos_filter(c, j + 3, fy, fx)
                    );

                    vec4 oValues = vec4(
                        getValueFromTensorPos_origin(b, oTensorChannel + j, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + j + 1, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + j + 2, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + j + 3, oy, ox)
                      );

                    res += dot(fValues, oValues);
                }

                if (${filter_remainder_vec4} == 1) {
                    res += dot(
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4}, fy, fx),
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4}, oy, ox));
                } else if (${filter_remainder_vec4} == 2) {
                    vec2 fValues = vec2(
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4}, fy, fx),
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4} + 1, fy, fx)
                    );
                    vec2 oValues = vec2(
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4}, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4} + 1, oy, ox)
                      );
                    res += dot(fValues, oValues);
                } else if (${filter_remainder_vec4} == 3) {
                    vec3 fValues = vec3(
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4}, fy, fx),
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4} + 1, fy, fx),
                        getValueFromTensorPos_filter(c, ${filter_nearest_vec4} + 2, fy, fx)
                    );
                    vec3 oValues = vec3(
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4}, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4} + 1, oy, ox),
                        getValueFromTensorPos_origin(b, oTensorChannel + ${filter_nearest_vec4} + 2, oy, ox)
                    );
                    res += dot(fValues, oValues);
                }

                ox += ${dilation_h};
            }
            oy += ${dilation_v};
        }

        ${bias ? 'res += getValueFromTensorPos_bias(0, 0, 0, c);' : ''}

        if (${fuse_relu}) {
            res = max(0.0, res);
        }
        else if (${act_type === 'relu6'}) {
            res = min(max(0.0, res), 6.0);
        }

        setOutput(res);
    }
    `;
}

export default {
    mainFunc,
    textureFuncConf: {
        filter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos'],
        bias: ['getValueFromTensorPos']
    },
    behaviors: [
        'adaptPaddings',
        'isApplySeparableConv',
        'batchComputeConv2d',
        'processBias'
    ]
};

