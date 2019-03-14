export default `
attribute vec4 position;
varying vec2 vCoord;
varying vec2 sCoord;

void main() {
    vCoord.x = (position.x + 1.0) / 2.0;
    vCoord.y = (position.y + 1.0) / 2.0;
    sCoord.xy = position.xy;
    gl_Position = position;
}
`
