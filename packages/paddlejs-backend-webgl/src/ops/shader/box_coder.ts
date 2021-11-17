/**
 * @file conv2d
 */

/* eslint-disable max-lines-per-function */
function mainFunc(
    {},
    { code_type }
) {
    const isDecode = code_type === 'decode_center_size';
    const getBoxVarDataFuncStr = isDecode
        ? `
            return vec2(
                getValueFromTensorPos_targetbox(r, g, b, m),
                getValueFromTensorPos_targetbox(r, g, b, n)
            );
        `
        : `
            float start = getValueFromTensorPos_targetbox(r, g, b, m);
            float end = getValueFromTensorPos_targetbox(r, g, b, n);
            float len = end - start;
            return vec2(start + len / 2.0, len);
        `;
    const postStr = isDecode
        ? `
            float b1 = p2 * v1 * t1 + p1;
            float b2 = exp(v2 * t2) * p2;
            if (a == 0 || a == 1) {
                o = b1 - b2 / 2.0 ;
            }
            else {
                o = b1 + b2 / 2.0;
            }
        `
        : `
            if (a == 0 || a == 1) {
                o = (t1 - p1) / p2 / v1;
            }
            else {
                o = log(abs(t2 / p2)) / v2;
            }
        `;

    return `
    // start函数
    vec2 getPriorBoxData(int r, int g, int b, int m, int n) {
        float start = getValueFromTensorPos_priorbox(r, g, b, m);
        float end = getValueFromTensorPos_priorbox(r, g, b, n);
        float len = end - start;
        return vec2(start + len / 2.0, len);
    }
    vec2 getBoxVarData(int r, int g, int b, int m, int n) {
        return vec2(
            getValueFromTensorPos_priorboxvar(r, g, b, m),
            getValueFromTensorPos_priorboxvar(r, g, b, n)
        );
    }
    vec2 getTargetBoxData(int r, int g, int b, int m, int n) {
        ${getBoxVarDataFuncStr}
    }

    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        int r = int(oPos.r);
        int g = int(oPos.g);
        int b = int(oPos.b);
        int a = int(oPos.a);
        // int r = 0;
        // int g = 0;
        // int b = 0;
        // int a = 0;
        // 输出坐标转换为输入坐标
        float o = 0.0;

        int m = 0;
        int n = 0;
        if (a == 0 || a == ${isDecode ? 2 : 1}) {
            m = 0;
            n = 2;
        }
        else {
            m = 1;
            n = 3;
        }
        vec2 priorbox = getPriorBoxData(r, g, b, m, n);
        vec2 boxvar = getBoxVarData(r, g, b, m, n);
        vec2 targetbox = getTargetBoxData(r, g, b, m, n);
        float p1 = priorbox.r;
        float p2 = priorbox.g;
        float t1 = targetbox.r;
        float t2 = targetbox.g;
        float v1 = boxvar.r;
        float v2 = boxvar.g;

        ${postStr}
        setOutput(float(o));
    }
    `;
}

export default {
    mainFunc,
    params: [
        'code_type'
    ],
    textureFuncConf: {
        targetbox: ['getValueFromTensorPos'],
        priorbox: ['getValueFromTensorPos'],
        priorboxvar: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
};

