#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
varying vec2 vCoord;
uniform sampler2D mapA;
uniform sampler2D mapB;

void main(void) {
    vec4 colorA = texture2D(mapA, vCoord);
    vec4 colorB = texture2D(mapB, vCoord);
    gl_FragColor = vec4(colorA.r + colorB.r, colorA.g + colorB.g, colorA.b + colorB.b, colorA.a + colorB.a);
}
