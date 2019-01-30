#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
#else
    precision mediump float;
    precision mediump int;
#endif

const int F_LENGTH = FILTER_SIZE;
const int O_LEGNTH = ORIGIN_SIZE;
const int outLength = OUT_SIZE;
uniform float filter[F_LENGTH * F_LENGTH];
uniform float origin[O_LEGNTH * O_LEGNTH];

varying vec2 vCoord;

vec2 transToOut(vec2 vcoord) {
    vec2 v2;
    v2.x = ceil(vcoord.x * float(outLength));
    v2.y = ceil(vcoord.y * float(outLength));
    return v2;
}

//float compute(float origin[O_LEGNTH * O_LEGNTH], float filter[F_LENGTH * F_LENGTH], vec2 tCoord) {
//    vec2 out_coord = transToOut(tCoord);
//    float result = 0.0;
//    for (int fy = 0; fy < F_LENGTH; fy++) {
//        int oy = int(out_coord.y) + fy;
//        for (int fx = 0; fx < F_LENGTH; fx++) {
//            int ox = int(out_coord.x) + fx;
//            if (oy >= 0 && oy < O_LEGNTH && ox >= 0 && ox < O_LEGNTH) {
//                // result += filter[int(F_LENGTH) * fy + fx] * origin[int(O_LEGNTH) * oy + ox];
//                // result += filter[int(F_LENGTH) * fy + fx];
//                result += origin[int(O_LEGNTH) * oy + ox];
//            }
//        }
//    }
//    return result;
//}

float getValue(float matrix[O_LEGNTH * O_LEGNTH], int x, int y){
    return matrix[int(O_LEGNTH) * x + y];
}

void main(void) {
    vec2 v2;
    v2.x = vCoord.x;
    v2.y = 1.0 - vCoord.y;
    vec2 outCoord = transToOut(vCoord);
    int curX = int(float(outLength) * vCoord.x);
    int curY = int(float(outLength) * vCoord.y);
    float result = 0.0;
    for (int fy = 0; fy < F_LENGTH; fy++) {
        int oy = int(outCoord.y) + fy;
        for (int fx = 0; fx < F_LENGTH; fx++) {
            int ox = int(outCoord.x) + fx;
            if (oy >= 0 && oy < O_LEGNTH && ox >= 0 && ox < O_LEGNTH) {
                // result += filter[int(F_LENGTH) * fy + fx] * origin[int(O_LEGNTH) * oy + ox];
                // result += filter[int(F_LENGTH) * fy + fx];
                result += getValue(origin, fy + curY, fx + curX);
            }
        }
    }

    vec4 v4;
    // v4.r = compute(origin, filter, v2);
    v4.r = result;
    gl_FragColor = v4;
}
