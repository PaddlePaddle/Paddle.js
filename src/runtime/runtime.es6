import Utils from '../utils/utils';
import Gpu from '../gpu/gpu';
import Matrix from '../utils/dims';
import Factory from '../factory/fshader/factory';
/**
 * @file gpu运行时
 * @author yangmingming
 *
 */
const VSHADER = require('../shader/v_shader.c');
let vsshader = '';
// 生成factory实例
const factory = new Factory({});
// 获取op的输入配置
const opConfs = factory.getOpConfs();
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

    async run(op, data) {
        const gpu = this.gpu;
        gpu.setOutProps(data);
        // 生成shader
        const fsCode = await factory.buildShader(op, data);
        console.dir([op + ', shaderCode shader', fsCode]);
        // 生成帧缓存材质
        const texture = gpu.makeTexure(WebGLRenderingContext.FLOAT, null);
        gpu.attachFrameBuffer(texture, data);
        let bufferStatus = gpu.frameBufferIsComplete();
        if (bufferStatus.isComplete) {
            console.log(bufferStatus.isComplete);
            // 获取shader
            if (!vsshader) {
                vsshader = await Utils.loadShader(VSHADER);
            }
            gpu.create(vsshader, fsCode);
            console.dir(['测试数据---输入参数', data]);
            // 开始计算
            this.compute(op, data);
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
            const tensor = opts[item.tensor];
            if (item.type === 'texture') {
                item.data = tensor.data;
                item['texture_width'] = tensor['texture_width'];
                item['texture_height'] = tensor['texture_height'];
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

    // 生成feed数据
    feed(pixelData, size) {
        return Utils.shapeData(pixelData, size);
    },

    // mock生成shapeB的数据
    mockShapeB(shapeA, shapeB) {
        return Utils.mock(shapeA, shapeB);
    },

    // mock origin 1 * 4 * 5 * 5
    mockOrigin() {
        return new Matrix({
            shape: [1, 4, 5, 5],
            name: 'origin'
        });
    },
    // pool2d mock data
    mockPoolOrigin() {
        return new Matrix({
            shape: [1, 4, 5, 5],
            name: 'origin' // 加value
        });
    },
    mockPoolOrigin2() {
        return new Matrix({
            shape: [1, 4, 5, 5],
            name: 'origin' // 加value
        });
    },

    // mock filter 4 * 4 * 3 * 3
    mockFilter() {
        let matrix = new Matrix({
            shape: [1, 4, 3, 3],
            type: 'texture',
            name: 'filter',
            value: new Float32Array([1.0, 1.0, 0.0, 0.0, -2.0, 0.0, 1.0, -3.0, 1.0])
        });
        return matrix;
    },
    mockFilter2() {
        let matrix = new Matrix({
            shape: [1, 4, 3, 3],
            type: 'texture',
            name: 'origin',
            value: new Float32Array([1.0, 1.0, 0.0, 0.0, -2.0, 0.0, 1.0, -3.0, 1.0])
        });
        return matrix;
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
