#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
#else
    precision mediump float;
    precision mediump int;
#endif
// canvas默认宽高
const int size = DIM_SIZE;

const int F_LENGTH = FILTER_SIZE;
const int O_LEGNTH = ORIGIN_SIZE;
const int outLength = OUT_SIZE;
// 步长
int stride = STRIDE;
// padding的数目
int padLeft = PAD_LEFT;
int padTop = PAD_TOP;
// dilation膨胀系数
int dilation = DILATION;

uniform float filter[F_LENGTH * F_LENGTH];
uniform sampler2D origin;

varying vec2 vCoord;
varying vec2 sCoord;

vec2 transToOut(vec2 vcoord) {
    vec2 v2;
    v2.x = vcoord.x * float(size);
    v2.y = vcoord.y * float(size);
    return v2;
}

float sigmoid(float x) {
    float result = 1.0 / (1.0 + exp(-x));
    return result;
}

void main(void) {
    vec2 v2;
    v2.x = vCoord.x;
    v2.y = vCoord.y;
    // 获取原始长度
    vec2 outCoord = transToOut(v2);
    // 输出数据
    vec4 v4;
    if (outCoord.x < float(outLength) && outCoord.y < float(outLength)) {
        float result = 0.0;
        // X、Y方向的移动步长
        int disX = -padLeft;
        int disY = -padTop;
        vec2 oriCoord;
        for (int fy = 0; fy < F_LENGTH; fy++) {
            float oy = floor(outCoord.y) * float(stride) + float(fy * dilation + disY);
            for (int fx = 0; fx < F_LENGTH; fx++) {
                float ox = floor(outCoord.x) * float(stride) + float(fx * dilation + disX);
                if (oy >= 0.0 && oy < float(O_LEGNTH) && ox >= 0.0 && ox < float(O_LEGNTH)) {
                    oriCoord.x = ox / float(O_LEGNTH);
                    oriCoord.y = oy / float(O_LEGNTH);
                    result += filter[int(F_LENGTH) * fy + fx] * texture2D(origin, oriCoord).r;
                }
            }
        }
        v4.r = result;
        v4.g = sigmoid(result);
        v4.b = outCoord.x;
        v4.a = outCoord.y;
    }
    gl_FragColor = v4;
}
