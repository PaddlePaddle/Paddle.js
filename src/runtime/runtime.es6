import Utils from '../utils/utils';
import Gpu from '../gpu/gpu';

/**
 * @file gpu运行时
 * @author yangmingming
 *
 */
const VSHADER = 'v_shader';
export default {
    /**
     * 初始化
     * @param opts 运行时参数，包含el：canvas，dim: 256
     * @return {object}
     */
    async init(opts = {}) {
        const gpu = this.gpu = new Gpu(opts);
        // 获取shader
        const vshaderCode = await Utils.loadShader(VSHADER);
        const fshaderCode = await Utils.loadShader('f_elementwise_add_shader');
        gpu.create(vshaderCode, fshaderCode);
        return this;
    },

    /**
     * 计算op, 并返回数据
     */
    compute() {
        return this.gpu.compute();
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
