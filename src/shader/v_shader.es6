/* eslint-disable */
/**
 * @file 顶点文件
 * @author yangmingming
 */
 export default `
precision highp float;
precision highp int;

attribute vec4 position;
varying vec2 vCoord;

void main() {
    vCoord.x = (position.x + 1.0) / 2.0;
    vCoord.y = (position.y + 1.0) / 2.0;
    gl_Position = position;
}
`;
