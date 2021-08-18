/**
 * @file texture_packing conv2d
 */

function mainFunc(
    { origin, filter, out },
    {
        groups = 1,
        strides = [],
        paddings = [],
        dilations = [],
        fuse_relu,
        act_type
    }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const [dilation_v = 1, dilation_h = 1] = dilations;
    return `
    void main() {
        ivec4 oPos = getOutputTensorPos();
        int x = oPos.a;
        int c = oPos.g;
        int y = oPos.b;
        int b = oPos.r;
        vec4 res = vec4(0.0, 0.0, 0.0, 0.0);

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
                for (int j = 0; j < ${filter.channel}; j += 1) {
                    int c0 = (c / (${out.channel} * 4 / ${groups})) * ${filter.channel} + j;
                    vec4 fValue = getValueFromTensorPosPacking_filter(c * 4, j, fy, fx);
                    vec4 oValue = getValueFromTensorPosPacking_origin(b, c0, oy, ox);

                    for (int packed_index = 0; packed_index < 4; packed_index++) {
                        if (packed_index == 0) {
                            res.r += dot(fValue, oValue);
                        } else if (packed_index == 1) {
                            int c1 = ((c + 1) / (${out.channel} * 4 / ${groups})) * ${filter.channel} + j;
                            oValue = getValueFromTensorPosPacking_origin(b, c1, oy, ox);
                            fValue = getValueFromTensorPosPacking_filter(c * 4 + 1, j, fy, fx);
                            res.g += dot(fValue, oValue);
                        } else if (packed_index == 2) {
                            int c2 = ((c + 2) / (${out.channel} * 4 / ${groups})) * ${filter.channel} + j;
                            oValue = getValueFromTensorPosPacking_origin(b, c2, oy, ox);
                            fValue = getValueFromTensorPosPacking_filter(c * 4 + 2, j, fy, fx);
                            res.b += dot(fValue, oValue);
                        } else if (packed_index == 3) {
                            int c3 = ((c + 3) / (${out.channel} * 4 / ${groups})) * ${filter.channel} + j;
                            oValue = getValueFromTensorPosPacking_origin(b, c3, oy, ox);
                            fValue = getValueFromTensorPosPacking_filter(c * 4 + 3, j, fy, fx);
                            res.a += dot(fValue, oValue);
                        }
                    }
                }
                ox += ${dilation_h};
            }
            oy += ${dilation_v};
        }

        res += getValueFromTensorPosPacking_bias(0, c, 0, 0);
        if (${fuse_relu}) {
            res = max(vec4(0.0, 0.0, 0.0, 0.0), res);
        }
        else if (${act_type === 'relu6'}) {
            res = min(max(vec4(0.0, 0.0, 0.0, 0.0), res), vec4(6.0, 6.0, 6.0, 6.0));
        }
        setPackedOutput(res);
    }
    `;
}

export default {
    mainFunc,
    params: [
        'strides',
        'paddings',
        'dilations',
        'groups',
        'act_type'
    ],
    textureFuncConf: {
        filter: ['getValueFromTensorPosPacking'],
        origin: ['getValueFromTensorPosPacking'],
        bias: ['getValueFromTensorPosPacking']
    },
    behaviors: [
        'adaptPaddings',
        'isApplySeparableConv',
        'batchComputeConv2d',
        'processBias'
    ]
};

