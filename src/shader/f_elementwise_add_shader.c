#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
varying vec2 vCoord;
uniform sampler2D map;

void main(void) {
    vec4 color = texture2D(map, vCoord);
    // 数据分别在r和g channel
    color.r += color.g;
    gl_FragColor = color;
}