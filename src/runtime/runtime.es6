import Utils from '../utils/utils';
import Gpu from '../gpu/gpu';

/**
 * @file gpu运行时
 * @author yangmingming
 *
 */
const VSHADER = require('../shader/v_shader.c');
const FSHADER_ADD = require('../shader/f_elementwise_add_shader.c');
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
        // 获取shader
        const vshaderCode = await Utils.loadShader(VSHADER);
        const fshaderCode = await Utils.loadShader(FSHADER_ADD);
        gpu.create(vshaderCode, fshaderCode);
        return this;
    },

    /**
     * 计算op
     * @param bufferA
     * @param bufferB
     */
    compute(bufferA, bufferB) {
        this.gpu.render(bufferA, bufferB);
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

    // 更新op
    updateOp(name) {
        // this.gpu.updateShader();
    },

    // 释放资源
    dispose() {
        this.gpu.dispose();
    }
};
