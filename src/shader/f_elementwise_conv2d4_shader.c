 #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
 #else
    precision mediump float;
    precision mediump int;
 #endif
// canvas默认宽高
const int size_w = DIM_SIZE_WIDTH;
const int size_h = DIM_SIZE_HEIGHT;

// 拆分filter的宽高，不一定相等
const int filter_w = FILTER_SIZE_WIDTH;
const int filter_h = FILTER_SIZE_HEIGHT;

// 拆分输入张量
const int origin_w = ORIGIN_SIZE_WIDTH;
const int origin_h = ORIGIN_SIZE_HEIGHT;

// 拆分输出张量的宽高，不一定相等
const int out_w = OUT_SIZE_WIDTH;
const int out_h = OUT_SIZE_HEIGHT;

// 拆分步长
const int stride_h = STRIDE_HORIZONTAL;
const int stride_v = STRIDE_VERTICAL;

// padding的数目
const int padLeft = PAD_LEFT;
const int padTop = PAD_TOP;

// dilation膨胀系数
const int dilation_h = DILATION_HORIZONTAL;
const int dilation_v = DILATION_VERTICAL;

uniform float filter[filter_w * filter_h];
uniform sampler2D origin;

varying vec2 vCoord;
varying vec2 sCoord;

vec2 transToOut(vec2 vcoord) {
    vec2 v2;
    v2.x = vcoord.x * float(size_w);
    v2.y = vcoord.y * float(size_h);
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
    if (outCoord.x < float(out_w) && outCoord.y < float(out_h)) {
        float result_r = 0.0;
        float result_g = 0.0;
        float result_b = 0.0;
        float result_a = 0.0;
        // X、Y方向的移动步长
        int disX = -padLeft;
        int disY = -padTop;
        vec2 oriCoord;
        for (int fy = 0; fy < filter_h; fy++) {
            float oy = floor(outCoord.y) * float(stride_v) + float(fy * dilation_v + disY);
            for (int fx = 0; fx < filter_w; fx++) {
                float ox = floor(outCoord.x) * float(stride_h) + float(fx * dilation_h + disX);
                if (oy >= 0.0 && oy < float(origin_h) && ox >= 0.0 && ox < float(origin_w)) {
                    oriCoord.x = ox / float(origin_w);
                    oriCoord.y = oy / float(origin_h);
                    result_r += filter[int(filter_w) * fy + fx] * texture2D(origin, oriCoord).r;
                    result_g += filter[int(filter_w) * fy + fx] * texture2D(origin, oriCoord).g;
                    result_b += filter[int(filter_w) * fy + fx] * texture2D(origin, oriCoord).b;
                    result_a += filter[int(filter_w) * fy + fx] * texture2D(origin, oriCoord).a;
                }
            }
        }
        float result = result_r + result_g + result_b + result_a;
        v4.r = result;
        v4.g = result;
        v4.b = result;
        v4.a = result;
    }
    gl_FragColor = v4;
}
