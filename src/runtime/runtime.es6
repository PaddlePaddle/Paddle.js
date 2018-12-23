import Utils from '../utils/utils';
import Gpu from '../gpu/gpu';
import Matrix from '../utils/dims';

/**
 * @file gpu运行时
 * @author yangmingming
 *
 */
const VSHADER = require('../shader/v_shader.c');
const FSHADER_ADD = require('../shader/f_elementwise_add_shader.c');
const FSHADER_CON2D = require('../shader/f_elementwise_conv2d2_shader.c');
export default {
    /**
     * 引入资源
     * @param {string} url 图片地址
     */
    create(url, shape) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = function () {
                console.log('raw width = ' + this.width + ', raw height = ' + this.height);
                resolve(Utils.imgCompress(img, {w: shape[2], h: shape[3]}));
            };
            img.src = url;
        });
    },

    /**
     * 初始化
     * @param opts 运行时参数，包含el：canvas，dim: 256
     * @return {object}
     */
    async init(opts = {}) {
        const gpu = this.gpu = new Gpu(opts);
        if (gpu.isFloatingTexture()) {
            let texture = gpu.makeTexure(WebGLRenderingContext.FLOAT, null);
            let framebuffer  = gpu.attachFrameBuffer(texture);
            let bufferStatus = gpu.frameBufferIsComplete();
            if (bufferStatus.isComplete) {
                // 获取shader
                const vshaderCode = await Utils.loadShader(VSHADER);
                const fshaderCode = await Utils.loadShader(FSHADER_ADD);
                gpu.create(vshaderCode, fshaderCode);
                return this;
            } else {
                return bufferStatus.message;
            }

        } else {
            return null;
        }
    },

    /**
     * 初始化, conv_2d
     * @param {Object} opts 运行时参数，包含el：canvas，dim: 256
     * @return {Object} this 实例对象
     */
    async init2(opts = {}) {
        const gpu = this.gpu = new Gpu(opts);
        if (gpu.isFloatingTexture()) {
            let texture = gpu.makeTexure(WebGLRenderingContext.FLOAT, null);
            let framebuffer  = gpu.attachFrameBuffer(texture);
            let bufferStatus = gpu.frameBufferIsComplete();
            if (bufferStatus.isComplete) {
                // 获取shader
                const vshaderCode = await Utils.loadShader(VSHADER);
                let fshaderCode = await Utils.loadShader(FSHADER_CON2D);
                fshaderCode = fshaderCode.replace(/FILTER_SIZE/g, opts.f_length);
                fshaderCode = fshaderCode.replace(/ORIGIN_SIZE/g, opts.o_length);
                fshaderCode = fshaderCode.replace(/OUT_SIZE/g, opts.out_length);
                gpu.create(vshaderCode, fshaderCode);
                return this;
            } else {
                return bufferStatus.message;
            }

        } else {
            return null;
        }

    },

    /**
     * 计算op
     * @param bufferA
     * @param bufferB
     */
    compute(bufferA, bufferB, type) {
        this.gpu.render(bufferA, bufferB, type);
    },

    /**
     * 读取op计算结果, 并返回数据
     */
    read() {
        return this.gpu.compute();
    },

    // 生成feed数据
    feed(pixelData, size) {
        return Utils.shapeData(pixelData, size);
    },

    // mock生成shapeB的数据
    mockShapeB(shapeA, shapeB) {
        return Utils.mock(shapeA, shapeB);
    },

    // mock origin 1 * 5 * 5
    mockOrigin() {
        return new Matrix({
            sx: 5,
            sy: 5,
            depth: 4
        });
    },

    // mock filter 1 * 3 * 3
    mockFilter() {
        return new Float32Array([1.0, 1.0, 0.0, 0.0, 2.0, 0.0, 1.0, 3.0, 1.0]);
    },

    // 更新op
    updateOp(name) {
        // this.gpu.updateShader();
    },

    // 释放资源
    dispose() {
        this.gpu.dispose();
    }
};
