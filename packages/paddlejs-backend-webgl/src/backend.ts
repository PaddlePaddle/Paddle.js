/**
 * @file webgl backend
 * @author yueshuangyan
 */

import { PaddlejsBackend, env } from '@paddlejs/paddlejs-core';
import { OpData, Query, OpUniform } from './types';
import { GLHelper, EShaderType } from './webgl/WebGLUtils';
import { GLTexture, TextureConfig } from './webgl/WebGLTexture';
import { vShaderSource, vShaderData } from './ops/vShader';
import buildShader from './webgl/buildShader';
import GLProgram from './webgl/WebGLProgram';
import { getSizeFromShape } from './utils/dataProcess';
import queryProcess from './utils/queryProcess';

export default class WebGLBackend extends PaddlejsBackend {
    gl: WebGLRenderingContext;
    glVersion: number;
    program?: GLProgram | null;
    frameBuffer?: WebGLFramebuffer | null;
    pbo?: WebGLBuffer | null;
    vertexBuffer?: WebGLBuffer | null;
    textureConf: TextureConfig | null;
    currentTexture?: WebGLTexture | null;
    textureBufferIndex?: number;
    cacheTextures: object;
    texturesMap: object;
    uniformLocations: object;
    width_shape_out: number;
    height_shape_out: number;
    width_texture_out: number;
    height_texture_out: number;
    channel: number;
    total_shape: number;
    vShader?: WebGLShader;
    MAX_TEXTURE_SIZE: number;
    queryList: Query[];

    constructor() {
        super();
        // 计算texture cache
        this.cacheTextures = {};
        this.uniformLocations = {};
        // texture buffer
        this.texturesMap = {};
        this.queryList = [];
        // 当前op输出texture
        this.currentTexture = null;

        this.width_shape_out = 1;
        this.height_shape_out = 1;
        this.width_texture_out = 1;
        this.height_texture_out = 1;
        this.channel = 0;
        this.total_shape = 0;

    }

    async init() {
        // 初始化webgl环境
        const gl = this.gl = GLHelper.createWebGLRenderingContext();
        if (!this.gl) {
            return;
        }
        this.glVersion = GLHelper.getWebglVersion();

        // texture conf
        this.textureConf = GLTexture.getTextureConfig(gl);

        // use 2048 as MAX_TEXTURE_SIZE in half float mode.
        this.MAX_TEXTURE_SIZE = env.get('MAX_TEXTURE_SIZE') || gl.getParameter(gl.MAX_TEXTURE_SIZE);

        // 关闭相关功能
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.BLEND);
        gl.disable(gl.DITHER);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.disable(gl.SAMPLE_COVERAGE);
        gl.enable(gl.SCISSOR_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vShaderData, gl.STATIC_DRAW);
        // 生成vertextShader
        this.vShader = GLHelper.initShader(gl, EShaderType.VS_SHADER, vShaderSource[this.glVersion - 1]);
        // 帧缓存
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        // pbo
        this.pbo = gl.createBuffer();
    }



    createProgram({ op, outTensor, inputTensors, shaderParams, runtime, isFinalOp }) {
        let programInstance = null;
        try {
            const tensors = [outTensor, ...inputTensors];
            tensors.forEach(tensor => GLHelper.genTextureInfoFromTensorShape(this.MAX_TEXTURE_SIZE, tensor));
            // genFscode
            const fsCode = buildShader(this.textureConf, op, tensors, shaderParams, runtime);

            programInstance = new GLProgram(this.gl, this.vShader as WebGLShader, fsCode, outTensor);
            programInstance.fsCode = fsCode;

            const outTexture = GLTexture.genOutputTexture(this.gl, this.textureConf, outTensor, isFinalOp);

            this.texturesMap[outTensor.tensorId] = outTexture;

            this.program = programInstance;
        }
        catch (e) {
            console.error(`webgl createProgram: ${op.name} -- ` + e);
        }
        return programInstance;
    }

    runProgram(opData: OpData, isRendered: boolean) {
        let query = queryProcess.beginQuery(this.gl, this.glVersion);
        const isPacked = opData.isPackedOp;
        // 设置gpu参数
        opData.program.forEach((program: GLProgram, index) => {
            const outTensor = opData.outputTensors[index];
            const tensorId = outTensor.tensorId;
            this.setOutProps(outTensor);

            if (opData.bufferType === 'frameBuffer') {
                // render to frame buffer
                this.attachFrameBuffer(tensorId);
            }
            else {
                // render to color buffer
                this.attachColorBuffer();
            }
            program.setProgram(this.gl, this.vertexBuffer, isRendered);
            this.program = program;
            this.render(opData, isRendered, index, isPacked);
        });

        if (query) {
            this.queryList.push({ name: opData.name, query, count: 1 });
            query = queryProcess.endQuery(this.gl, this.glVersion, query);
        }
    }

    async read(fetchInfo): Promise<number[]> {
        if (env.get('webgl_gpu_pipeline')) {
            const gl = this.gl as WebGLRenderingContext;
            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            return [];
        }

        const pbo = this.createPBO();
        await this.createAndWaitForFence();
        const result = this.downloadFloat32TensorFromBuffer(pbo);

        const shape = fetchInfo ? fetchInfo.shape : [];
        if (env.get('webgl_pack_output')) {
            return result.slice(0, getSizeFromShape(shape));
        }

        return result;
    }

    createPBO() {
        const textureConf = this.textureConf as TextureConfig;
        if (this.glVersion === 2) {
            const gl2 = this.gl as WebGL2RenderingContext;
            const buffer = this.pbo;
            gl2.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer);
            const sizeBytes = 4 * 4 * this.width_texture_out * this.height_texture_out;
            gl2.bufferData(gl2.PIXEL_PACK_BUFFER, sizeBytes, gl2.STREAM_READ);
            gl2.readPixels(0, 0, this.width_texture_out, this.height_texture_out, gl2.RGBA, gl2.FLOAT, 0);
            gl2.bindBuffer(gl2.PIXEL_PACK_BUFFER, null);
            return buffer;
        }

        let downloadData;
        const gl = this.gl as WebGLRenderingContext;
        let textureType = gl.FLOAT;
        if (textureConf.isFloatTextureReadPixelsEnabled) {
            downloadData = new Float32Array(this.width_texture_out * this.height_texture_out * 4);
        }
        else {
            downloadData = new Uint8Array(this.width_texture_out * this.height_texture_out * 4);
            textureType = gl.UNSIGNED_BYTE;
        }
        gl.readPixels(
            0,
            0,
            this.width_texture_out,
            this.height_texture_out,
            gl.RGBA,
            textureType,
            downloadData);
        if (textureConf.isFloatTextureReadPixelsEnabled) {
            return downloadData;
        }
        const newBuffer = new Float32Array(downloadData.buffer);
        return newBuffer;

    }

    async createAndWaitForFence() {
        const gl2 = this.gl as WebGL2RenderingContext;
        const isFenceEnabled = (gl2.fenceSync != null);
        let isFencePassed = () => true;
        if (isFenceEnabled) {
            const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
            gl2.flush();
            isFencePassed = () => {
                const status = gl2.clientWaitSync(sync, 0, 0);
                return status === gl2.ALREADY_SIGNALED
                    || status === gl2.CONDITION_SATISFIED;
            };
        }
        return new Promise(resolve => {
            this.pollItem(isFencePassed, resolve);
        });
    }

    pollItem(isDone, resolveFn) {
        const fn = () => {
            if (isDone()) {
                resolveFn();
                return;
            }
            setTimeout(fn, 1);
        };
        fn();
    }

    downloadFloat32TensorFromBuffer(buffer) {
        const size: number = 4 * this.width_texture_out * this.height_texture_out;
        if (this.glVersion === 2) {
            const gl2 = this.gl as WebGL2RenderingContext;
            const pixels = new Float32Array(size);
            gl2.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer);
            gl2.getBufferSubData(gl2.PIXEL_PACK_BUFFER, 0, pixels);
            gl2.bindBuffer(gl2.PIXEL_PACK_BUFFER, null);

            const result: number[] = [];
            if (env.get('webgl_pack_output')) {
                return Array.from(pixels);
            }
            for (let i = 0; i < this.width_texture_out * this.height_texture_out; i++) {
                result.push(pixels[4 * i]);
            }
            return result;
        }

        const pixels = buffer;
        const result = [] as number[];
        for (let i = 0; i < this.width_texture_out * this.height_texture_out; i++) {
            const index = (this.textureConf as TextureConfig).isFloatTextureReadPixelsEnabled ? 4 * i : i;
            result.push(pixels[index]);
        }
        return result;

    }

    setOutProps(outTensor?) {
        const {
            width_shape = 1,
            height_shape = 1,
            width_texture = 1,
            height_texture = 1,
            channel = 0,
            total_shape = 0
        } = outTensor;

        this.width_shape_out = width_shape;
        this.height_shape_out = height_shape;
        this.width_texture_out = width_texture;
        this.height_texture_out = height_texture;
        this.channel = channel;
        this.total_shape = total_shape;
    }

    attachColorBuffer() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.canvas.width = this.width_shape_out;
        gl.canvas.height = this.height_shape_out;
        gl.viewport(
            0,
            0,
            gl.canvas.width,
            gl.canvas.height
        );
        gl.scissor(
            0,
            0,
            gl.canvas.width,
            gl.canvas.height
        );
    }

    attachFrameBuffer(tensorId: string) {
        this.currentTexture = this.texturesMap[tensorId];

        const gl = this.gl;
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, // The target is always a FRAMEBUFFER.
            gl.COLOR_ATTACHMENT0, // We are providing the color buffer.表示texture是颜色关联对象
            gl.TEXTURE_2D, // This is a 2D image texture.
            this.currentTexture as WebGLTexture, // The texture.
            0 // 0, we aren't using MIPMAPs
        );
        gl.viewport(
            0,
            0,
            this.width_texture_out,
            this.height_texture_out
        );
        gl.scissor(
            0,
            0,
            this.width_texture_out,
            this.height_texture_out
        );
    }

    render(
        opData: OpData,
        isRendered: Boolean = false,
        index: number,
        isPacked: Boolean = false
    ) {
        const {
            inputTensors = [],
            uniform = null,
            iLayer = 0,
            modelName
        } = opData;
        const gl = this.gl;
        let textureIndex = 0;

        inputTensors.forEach(item => {
            this.initTexture(textureIndex, item, isPacked);
            const loc = this.getUniformLoc('texture_' + item.name, iLayer, isRendered, index, modelName);
            if (!loc) {
                return;
            }
            gl.uniform1i(loc, textureIndex++);
        });
        if (uniform) {
            this.setUniform(uniform, iLayer, isRendered, index, modelName);
        }
        // gl.clearColor(.0, .0, .0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    initTexture(index, item, isPacked) {
        const gl = this.gl;
        const textureConf = this.textureConf as TextureConfig;
        const tensorName = item.tensorId;
        const packed = isPacked || item.isPacked;
        const data = item.data;
        let texture;

        if (!item.persistable) {
            texture = this.texturesMap[tensorName];
        }
        else {
            this.cacheTextures = this.cacheTextures || {};
            const cacheTexture = this.cacheTextures[tensorName];

            if (cacheTexture) {
                texture = cacheTexture;
                // 一般情况下 cacheTexture 对应的tensor 数据在上传后已销毁
                // 如果 data 和 cacheTexture 共存，说明 tensor data 和 shape 已改变，比如用户输入图像 image tensor
                data && GLHelper.genTextureInfoFromTensorShape(this.MAX_TEXTURE_SIZE, item);
            }
            else {
                texture = gl.createTexture();
                this.cacheTextures[tensorName] = texture;
            }
        }

        gl.activeTexture(gl[`TEXTURE${index}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        if (data) {
            GLTexture.uploadDataToTexture(gl, textureConf, item, packed);
            // 数据上传至 texture 后进行销毁
            item.data = null;
        }
    }

    setUniform(uniform: OpUniform, iLayer, isRendered, index, modelName) {
        const uniformParamKeys = Object.keys(uniform);
        const gl = this.gl;
        uniformParamKeys.forEach(key => {
            const uniformType = uniform[key].type;
            const uniformValue = uniform[key].value;
            const loc = this.getUniformLoc(key, iLayer, isRendered, index, modelName);
            GLHelper.setUniformParam(gl, loc, uniformType, uniformValue);
        });
    }

    getUniformLoc(name, ilayer, isRendered, index, modelName) {
        const prefix = modelName + '_';
        if (isRendered) {
            return this.uniformLocations[prefix + ilayer][name + index];
        }
        const loc = this.gl.getUniformLocation((this.program as GLProgram).program as WebGLProgram, name);
        // 缓存
        this.uniformLocations[prefix + ilayer] = this.uniformLocations[prefix + ilayer] || {};
        this.uniformLocations[prefix + ilayer][name + index] = loc;
        return loc;
    }

    dispose() {

    }
}
