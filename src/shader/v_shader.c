attribute vec4 position;
varying vec2 vCoord;

void main() {
    vCoord = position.xy * 0.5 + 0.5;
    gl_Position = position;
}