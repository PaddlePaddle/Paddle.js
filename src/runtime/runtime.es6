import Utils from '../utils/utils';
import Gpu from '../gpu/gpu';
import Tensor from '../utils/tensor';
import OpData from '../utils/opData';
import Factory from '../factory/fshader/factory';
import VSHADER from '../shader/v_shader';
/**
 * @file gpu运行时
 * @author yangmingming
 *
 */
// 生成factory实例
const factory = new Factory({});
// 获取op的输入配置
const opConfs = factory.getOpConfs();
export default {
    /**
     * 初始化, 生成gpu实例
     * @param {Object} opts 运行时参数，包含el：canvas，dim: 256
     * @return {Object} this 实例对象
     */
    init(opts = {}) {
        const gpu = this.gpu = new Gpu(opts);
        if (gpu.isFloatingTexture()) {
            return this;
        } else {
            return null;
        }
    },

    run(op, data) {
        // 生成op的数据
        const  opData = this.adaptData(op, data);
        // 设置gpu参数
        const gpu = this.gpu;
        gpu.setOutProps(opData.tensor['out']);
        // 生成shader
        const fsCode = factory.buildShader(op, opData.data);
        console.dir([op + ', shaderCode shader', fsCode]);
        // 生成帧缓存材质
        const texture = gpu.makeTexure(WebGLRenderingContext.FLOAT, null);
        gpu.attachFrameBuffer(texture, opData.data);
        let bufferStatus = gpu.frameBufferIsComplete();
        if (bufferStatus.isComplete) {
            // console.log(bufferStatus.isComplete);
            gpu.create(VSHADER, fsCode);
            // console.dir(['测试数据---输入参数', data]);
            // 开始计算
            this.compute(op, opData);
            return this;
        } else {
            return bufferStatus.message;
        }
    },

    /**
     * 计算op
     *
     * @param {Object} opts 输入数据
     */
    compute(op, opts = {}) {
        // 配置op的输入数据
        const data = opConfs[op].map(item => {
            const tensor = opts.tensor[item.tensor];
            if (item.type === 'texture') {
                item.data = tensor.data;
                item['width_texture'] = tensor['width_texture'];
                item['height_texture'] = tensor['height_texture'];
            } else if (item.type === 'uniform') {
                item.data = tensor[item.variable];
            }
            return item;
        });

        this.gpu.render(data);
    },

    /**
     * 读取op计算结果, 并返回数据
     */
    read() {
        return this.gpu.compute();
        // return Utils.shapeData(this.gpu.compute(), [4, 1, 3, 3]);
    },

    adaptData(op, data = {}) {
        const opData = new OpData(op, data.inputs, data.outputs, data.attrs);
        return opData;
    },

    // 释放资源
    dispose() {
        this.gpu.dispose();
    }
};
