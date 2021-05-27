/**
 * @file vertext shader code
 */

const vShaderSource = [
    // webgl1
    `
    precision highp float;
    precision highp int;

    attribute vec4 position;
    varying vec2 vCoord;

    void main() {
        vCoord.x = (position.x + 1.0) / 2.0;
        vCoord.y = (position.y + 1.0) / 2.0;
        gl_Position = position;
    }
    `,
    // webgl2
    `#version 300 es
    in vec4 position;
    out vec2 vCoord;

    void main() {
        vCoord.x = (position.x + 1.0) / 2.0;
        vCoord.y = (position.y + 1.0) / 2.0;
        gl_Position = position;
    }
    `];

const vShaderData = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0
]);

export { vShaderSource, vShaderData };
