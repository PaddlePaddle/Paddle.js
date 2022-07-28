/**
 * @file pool2d_avg_adaptive
 * @desc https://www.paddlepaddle.org.cn/documentation/docs/zh/api/paddle/nn/AdaptiveAvgPool2D_cn.html#adaptiveavgpool2d
 */

function mainFunc(
    { origin },
    { strides = [], paddings = [], ksize }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const [ksize_y, ksize_x] = ksize;
    const H = origin.height_shape;
    const W = origin.width_shape;
    return `
    // start函数
    void main(void) {
        float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        int i = out_pos[2] * ${stride_v} - ${padTop};
        int j = out_pos[3] * ${stride_h} - ${padLeft};
        int hstart = int(floor(float(i) * float(${H}) / float(${ksize_y})));
        int hend = int(ceil(float(i + 1) * float(${H}) / float(${ksize_y})));
        int wstart = int(floor(float(j) * float(${W}) / float(${ksize_x})));
        int wend = int(ceil(float(j + 1) * float(${W}) / float(${ksize_x})));
        for (int fy = hstart; fy < hend; fy++) {
            for (int fx = wstart; fx < wend; fx++) {
                float curr = getValueFromTensorPos_origin(out_pos[0], out_pos[1], fy, fx);
                res += curr;
            }
        }
        int count_pool = (hend - hstart) * (wend - wstart);
        res = res / float(count_pool);
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: []
};
