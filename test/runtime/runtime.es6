import Utils from '../../src/utils/utils';
import Gpu from '../../src/gpu/gpu';
import Matrix from '../../src/utils/dims';

/**
 * @file gpu运行时
 * @author wangqun
 *
 */
// v_shader.c表示计算容器
const VSHADER = require('../../src/shader/v_shader.c');

export default {

    /**
     * 初始化op
     * @param {Object} opts 运行时参数，包含el：canvas，dim: 256
     * @return {Object} this 实例对象
     */
    async init(opts = {}, opShader) {
        console.log(opts);
        const gpu = this.gpu = new Gpu(opts);
        if (gpu.isFloatingTexture()) {
            let texture = gpu.makeTexure(WebGLRenderingContext.FLOAT, null);
            let framebuffer  = gpu.attachFrameBuffer(texture);
            let bufferStatus = gpu.frameBufferIsComplete();
            if (bufferStatus.isComplete) {
                console.log(bufferStatus.isComplete);
                // 获取shader
                const vshaderCode = await Utils.loadShader(VSHADER);
                let fshaderCode = await Utils.loadShader(opShader);
                fshaderCode = Utils.populateData('conv2d', fshaderCode, opts);
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
        return new Float32Array([1.0, 1.0, 0.0, 0.0, -2.0, 0.0, 1.0, -3.0, 1.0]);
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
