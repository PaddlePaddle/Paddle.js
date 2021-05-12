/**
 * @file bilinear_interp
 */

function mainFunc(
    { out, origin },
    { align_mode = 1, align_corners = true }
) {
    return `
    // start函数

    vec4 getData(float n, float scale, bool align_flag, int in_len) {
        float m = align_flag ? ((n + 0.5) / scale - 0.5) : (n / scale);
        int a1 = int(floor(m));
        a1 = a1 > 0 ? a1 : 0;
        int a2 = (a1 + 1) < (in_len - 1) ? (a1 + 1) : (in_len - 1);

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

        float scale_x = 0.0;
        float scale_y = 0.0;
        if (${align_corners}) {
            scale_x = float(${out.width_shape} - 1) / float(${origin.width_shape} - 1);
            scale_y = float(${out.height_shape} - 1) / float(${origin.height_shape} - 1);
        }
        else {
            scale_x = float(${out.width_shape}) / float(${origin.width_shape});
            scale_y = float(${out.height_shape}) / float(${origin.height_shape});
        }

        vec4 vx = getData(float(oPos.a), scale_x, align_flag, ${origin.width_shape});
        vec4 vy = getData(float(oPos.b), scale_y, align_flag, ${origin.height_shape});

        int x1 = int(vx.r);
        int x2 = int(vx.g);
        float x3 = vx.b;
        float x4 = vx.a;
        int y1 = int(vy.r);
        int y2 = int(vy.g);
        float y3 = vy.b;
        float y4 = vy.a;

        float value11 = getValueFromTensorPos_origin(oPos.r, oPos.g, y1, x1);
        float value12 = getValueFromTensorPos_origin(oPos.r, oPos.g, y2, x1);
        float value21 = getValueFromTensorPos_origin(oPos.r, oPos.g, y1, x2);
        float value22 = getValueFromTensorPos_origin(oPos.r, oPos.g, y2, x2);
        float value = x4 * y4 * value11 + x4 * y3 * value12 + x3 * y4 * value21 + x3 * y3 * value22;
        setOutput(float(value));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'align_corners',
        'align_mode'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
