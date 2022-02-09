/**
 * @file elementwise_mul
 */

function mainFunc(
    { counter },
    {
        counterPos,
        Scale_y = 1.0,
        Scale_x = 1.0,
        Scale_out = 1.0
    }
) {
    return `
    ivec4 formatNCHW(int n, int c, int h, int w) {
        int newN = n;
        int newC = c;
        int newH = h;
        int newW = w;

        if (n >= ${counter.height_texture / counter.height_shape}) {
            newN = int(${counter.height_texture / counter.height_shape});
        }
        if (c >= ${counter.channel}) {
            newC = int(${counter.channel - 1});
        }
        if (h >= ${counter.height_shape}) {
            newH = ${counter.height_shape  - 1};
        }
        if (w >= ${counter.width_shape}) {
            newW = ${counter.width_shape - 1};
        }
        return ivec4(newN, newC, newH, newW);
    }

    // start函数
    void main() {
        // 输出数据
        ivec4 oPos1 = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos1.r, oPos1.g, oPos1.b, oPos1.a);
        ivec4 oPos = formatNCHW(oPos1.r, oPos1.g, oPos1.b, oPos1.a);

        float c = getValueFromTensorPos_counter(${counterPos});
        float res = float(${Scale_out / Scale_x}) * o * float(${1 / Scale_y}) * c;
        setOutput(float(res));
    }

    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'processElementwiseAxis',
        'genElementwiseCounterPos'
    ]
};
