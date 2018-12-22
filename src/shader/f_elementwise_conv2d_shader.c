#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

const int F_LENGTH = FILTER_SIZE;
const int O_LEGNTH = ORIGIN_SIZE;
const int outLength = OUT_SIZE;
uniform float filter[F_LENGTH * F_LENGTH];
uniform float origin[O_LEGNTH * O_LEGNTH];

varying vec2 vCoord;

vec2 transToOut(vec2 vcoord) {
    vec2 v2;
    v2.x = int(vcoord.x * float(outLength));
    v2.y = int(vcoord.y * float(outLength));
    return v2;
}

float compute(float origin[O_LEGNTH * O_LEGNTH], float filter[F_LENGTH * F_LENGTH], tCoord) {
    vec2 out_coord = transToOut(tCoord);
    float result = 0.0;
    for (int fy = 0; fy < F_LENGTH; fy++) {
        int oy = out_coord.y + fy;
        for (int fx = 0; fx < F_LENGTH; fx++) {
            int ox = out_coord.x + fx;
            if (oy >= 0 && oy < O_LEGNTH && ox >= 0 && ox < O_LEGNTH) {
                result += filter[(F_LENGTH * fy) + fx] * origin[(O_LEGNTH * oy) + ox];
            }
        }
    }
    return result;
}

void main(void) {
    vec2 v2;
    v2.x = vCoord.x;
    v2.y = 1.0 - vCoord.y;
    vec4 v4;
    v4.r = compute(origin, filter, v2);
    gl_FragColor = v4;
}
