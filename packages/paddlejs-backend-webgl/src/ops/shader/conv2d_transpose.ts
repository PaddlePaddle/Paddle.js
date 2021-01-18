/**
 * @file conv2d_transpose
 */

function mainFunc({
    origin,
    filter,
    out
}, {
    groups = 1,
    strides = [],
    paddings = [],
    dilations = []
}) {
    const [stride_v = 1, stride_h = 1] = strides;
    let [padLeft = 0, padTop = 0] = paddings;
    padTop = filter.height_shape - padTop - 1;
    padLeft = filter.width_shape - padLeft - 1;
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
        int temp_x = 0;
        int temp_y = 0;
        float o = 0.0;
        float f = 0.0;

        // 获取output的坐标
        int oTensorChannel = int(c * ${groups} / ${out.channel}) * ${origin.channel};
        int oy = y - ${padTop};
        const int groupLen = int(${origin.channel} / ${groups});
        int groupIndex = int(c / groupLen);

        for (int fy = 0; fy < ${filter.height_shape}; fy++) {
            if (oy < 0) {
                oy += ${dilation_v};
                continue;
            }
            int ox = x - ${padLeft};
            for (int fx = 0; fx < ${filter.width_shape}; fx++) {

                if (ox < 0) {
                    ox += ${dilation_h};
                    continue;
                }
                // channel计算
                for (int j = 0; j < groupLen; j++) {
                    int curIndex = j + b * groupLen;
                    if (int(mod(float(ox), float(${stride_h}))) == 0 && int(mod(float(oy), float(${stride_v}))) == 0) {
                        temp_x = int(floor(float(ox) / float(${stride_h})));
                        temp_y = int(floor(float(oy) / float(${stride_v})));
                        if (temp_x < ${origin.width_shape} && temp_y < ${origin.height_shape}) {
                            o = getValueFromTensorPos_origin(b, curIndex , temp_y, temp_x);
                            f = getValueFromTensorPos_filter(
                                curIndex,
                                int(c / ${groups}),
                                ${filter.height_shape}-1-fy,
                                ${filter.width_shape}-1-fx
                            );
                            res += f * o;
                        }
                    }
                }
                ox += ${dilation_h};
            }
            oy += ${dilation_v};
        }
        setOutput(float(res));
    }
`;
}
export default {
    mainFunc,
    params: [
        'strides',
        'paddings',
        'dilations',
        'groups'
    ],
    textureFuncConf: {
        filter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'adaptPaddings',
        'isApplySeparableConv',
        'batchComputeConv2d',
        'processBias'
    ]
}; ;
