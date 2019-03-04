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

const int filter_shape_length = FILTER_SHAPE_LENGTH;
// filter材质的宽高
const int filter_texture_width = FILTER_TEXTURE_WIDTH;
const int filter_texture_height = FILTER_TEXTURE_HEIGHT;

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

// tensor data
const int tensor_length = TENSOR_LENGTH;
const int shape_length = SHAPE_LENGTH;

uniform int filterShape[FILTER_SHAPE_LENGTH];
uniform int filter_shape_numbers[FILTER_SHAPE_LENGTH];
uniform int shape_numbers[SHAPE_LENGTH];

uniform sampler2D origin;
uniform sampler2D filter;

varying vec2 vCoord;
varying vec2 sCoord;

// 公共方法
struct ivec5 {
    int x;
    int y;
    int z;
    int w;
    int u;
};

struct ivec6 {
    int x;
    int y;
    int z;
    int w;
    int u;
    int v;
};

// 获取材质中的数据
float getValueFromTexture(vec3 pos) {
    vec4 pixels = texture2D(filter, pos.xy);
    int d = int(pos.z);
    if (d == 0) {
        return pixels.r;
    }
    else if (d == 1) {
        return pixels.g;
    }
    else if (d == 2) {
        return pixels.b;
    }
    else {
        return pixels.a;
    }
}

// 从数组中获取tensor坐标的索引
int getIndexFromTensor(int shapeNumbers[SHAPE_LENGTH], ivec4 tensorPos) {
    int index = 0;
    for (int i = 0; i < SHAPE_LENGTH; i++) {
        index += tensorPos[i] * shapeNumbers[i];
    }
    return index;
}

// 获取材质元素在数组中的索引
int getIndexFromTexture(vec4 pos, int width, int height) {
    int x = int(floor(pos.x));
    int y = int(floor(pos.y));
    int d = int(floor(pos.z));
    return (width * y + x) * 4 + d;
}

// 探测数组元素索引为N的元素，在texture上的坐标, 深度从1开始
vec3 detectTexturePos(int n, int tWidth, int tHeight) {
    vec3 pos;
//    if (n < 4) {
//        pos = vec3(0.0, 0.0 , float(n + 1));
//    } else {
////        pos.z = mod(float(n + 1), 4.0);
////        pos.x = mod(float(n + 1) / 4.0, float(filter_texture_width));
////        if (int(pos.z) == 0) {
////            pos.x -= 1.0;
////            pos.z = 4.0;
////        }
////        pos.y = float(n + 1) / float(4 * filter_texture_width);
//        pos.z = mod(float(n), 4.0);
//        pos.x = mod(float(n) / 4.0, float(filter_texture_width));
//        pos.y = float(n) / float(4 * filter_texture_width);
//    }
    pos.z = mod(float(n), 4.0);
    pos.x = mod(float(n) / 4.0, float(filter_texture_width));
    pos.y = float(n) / float(4 * filter_texture_width);
    pos.x = pos.x / float(tWidth);
    pos.y = pos.y / float(tHeight);
    return pos;
}

// todo: 探测数组索引为N的元素，在tensor上的坐标
// ivec4 detectTensorPos(int n, int shapeLength, int shape[SHAPE_LENGTH]) {
//    int depth = shape[shapeLength - 1];
//    ivec4 pos;
//    if (n < (depth + 1)) {
//        pos[SHAPE_LENGTH - 1] = n;
//    }
//    return pos;
// }

// if 大于
float when_gt(float x, float y) {
    return max(sign(x - y), 0.0);
}

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
                    int index = getIndexFromTensor(shape_numbers, ivec4(0, fy, fx, 0));
                    vec3 pos = detectTexturePos(index, filter_texture_width, filter_texture_height);
                    result_r += getValueFromTexture(pos) * texture2D(origin, oriCoord).r;
                    result_g += getValueFromTexture(pos) * texture2D(origin, oriCoord).g;
                    result_b += getValueFromTexture(pos) * texture2D(origin, oriCoord).b;
                    result_a += getValueFromTexture(pos) * texture2D(origin, oriCoord).a;
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
