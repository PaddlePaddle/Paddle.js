#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
varying vec2 vCoord;
uniform sampler2D mapA;
uniform sampler2D mapB;

vec4 transTorgba(vec4 va, vec4 vb) {
    vec4 v4;
    v4.r = float((va.r + vb.r));
    v4.g = float((va.g + vb.g));
    v4.b = float((va.b + vb.b));
    v4.a = float((va.a + vb.a));
    return v4;
}

void main(void) {
    vec4 colorA = texture2D(mapA, vCoord);
    vec4 colorB = texture2D(mapB, vCoord);
    // gl_FragColor = vec4(colorA.r - colorB.r, colorA.g - colorB.g, colorA.b - colorB.b, colorA.a - colorB.a);
    // gl_FragColor = vec4(0.1, 0.2, 0.1, 0.5);
    gl_FragColor = transTorgba(colorA, colorB);
}
