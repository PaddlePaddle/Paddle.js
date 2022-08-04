/**
 * @file bilinear_interp
 */

function mainFunc(
    { out, origin },
    { align_mode = 1, align_corners = true }
) {
    const outW = out.width_shape;
    const inW = origin.width_shape;
    const scale = align_corners ? (outW - 1) / (inW - 1) : (outW / inW);

    return `
    // start函数

    vec4 getData(float n, float scale, bool align_flag, int in_len) {
        float m = align_flag ? ((n + 0.5) / scale - 0.5) : (n / scale);
        // int a1 = int(floor(m + 0.5));
        int a1 = int(m);
        a1 = a1 > 0 ? a1 : 0;
        int a2 = a1 < (in_len - 1) ? (a1 + 1) : in_len;

        float idx_src = (n + 0.5) / scale - 0.5;
        idx_src = idx_src > 0.0 ? idx_src : 0.0;
        float b1 = align_flag ? (idx_src - float(a1)) : (n / scale - float(a1));
        float b2 = 1.0 - b1;
        return vec4(float(a1), float(a2), b1, b2);
    }

    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();

        bool align_flag = ${align_mode} == 0 && !${align_corners};

        float scale = float(${scale});

        vec4 v = getData(float(oPos.a), scale, align_flag, ${inW});

        float v1 = v.r;
        float v2 = v.g;
        float v3 = v.b;
        float v4 = v.a;

        float value1 = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, int(v1));
        float value2 = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, int(v2));
        float value = v4 * value1 + v3 * value2;
        // setOutput(float(int(v1)));
        setOutput(float(value));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
