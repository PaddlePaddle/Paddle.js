/* eslint-disable */
/**
 * @file 顶点文件
 * @author yangmingming
 */
<<<<<<< HEAD
 export default `
precision highp float;
precision highp int;

=======
export default `
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
attribute vec4 position;
varying vec2 vCoord;

void main() {
    vCoord.x = (position.x + 1.0) / 2.0;
    vCoord.y = (position.y + 1.0) / 2.0;
    gl_Position = position;
}
`;
