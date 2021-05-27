/**
 * @file webgl program
 * @author yueshuangyan
 */

import { Tensor } from '../types';

export default class GLProgram {
    // ps常用的uniform命名
    public static readonly Sampler: string = 'uSampler'; // 纹理取样器

    // public gl: WebGLRenderingContext; // WebGL上下文渲染对象
    program?: WebGLProgram | null; // 链接器
    vShader: WebGLShader; // vertex shader编译器
    fShader: WebGLShader; // fragment shader编译器
    fsCode?: string;
    shape?: number[]; // 当前program输出shape

    public constructor(context: WebGLRenderingContext, vShader: WebGLShader, fShaderCode: string, outTensor: Tensor) {
        const gl = context;
        this.vShader = vShader;
        try {
            this.fShader = this.initShader(gl, fShaderCode, 'fragment');
            this.shape = outTensor && outTensor.shape;
            const program = this.program = gl.createProgram() as WebGLProgram;
            gl.attachShader(program, this.vShader);
            gl.attachShader(program, this.fShader);
            gl.linkProgram(program);
        }
        catch (e) {
            console.error(e);
        }
    }

    public initShader(gl, code: string, type = 'vertex') {
        const shaderType = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
        let shader;
        if (type === 'vertex' && this.vShader) {
            shader = this.vShader;
        }
        else {
            shader = gl.createShader(shaderType);
            if (type === 'vertex') {
                this.vShader = shader;
            }
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error('compile: ' + gl.getShaderInfoLog(shader));
            }
        }

        return shader;
    }

    public setProgram(gl: WebGLRenderingContext, vertexBuffer, isRendered) {
        gl.useProgram(this.program as WebGLProgram);
        if (!isRendered) {
            this.runVertexShader(gl, vertexBuffer);
        }
    }

    public runVertexShader(gl, vertexBuffer) {
        const aPosition = gl.getAttribLocation(this.program, 'position');
        // Turn on the position attribute
        gl.enableVertexAttribArray(aPosition);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    }
}
