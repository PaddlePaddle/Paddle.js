import Utils from '../../src/utils/utils';
import Gpu from '../../src/gpu/gpu';
import Matrix from '../../src/utils/dims';
import axios from 'axios';
var qs = require('qs');

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

    // get paddle mobile result
    getResult(inputs) {

        let that = this;
        axios.defaults.withCredentials = false;
        let params = {
            "name":"juanji",
            "input":'{"filter_size_width":3,"filter_size_height":3,"origin_size_width":5,"origin_size_height":5,"out_size_width":3,"out_size_height":3,"stride_horizontal":1,"stride_vertical":1,"pad_left":1,"pad_top":1,"dilation_horizontal":2,"dilation_vertical":2,"filter":[1,1,0,0,-2,0,1,-3,1],"origin":[6.36049222946167,8.311565399169922,2.682633638381958,3.1333861351013184,5.066527843475342,1.4297294616699219,3.7991783618927,3.824519157409668,1.2478519678115845,0.3274148404598236,4.149953842163086,5.434576034545898,5.598128318786621,3.745927095413208,4.385985851287842,8.32230281829834,7.887515544891357,4.811119556427002,8.510167121887207,2.098041296005249,3.4853157997131348,3.4725382328033447,8.41357135772705,2.30587100982666,1.1730622053146362,2.0535993576049805,4.393265724182129,4.870007514953613,7.31699800491333,2.2299277782440186,0.3741568922996521,7.30179500579834,4.229695796966553,8.03564167022705,6.257108688354492,0.6932467222213745,8.530153274536133,1.2166545391082764,5.796642780303955,6.1617326736450195,7.8173956871032715,3.041306734085083,9.004706382751465,6.22284460067749,0.6868140697479248,2.3208162784576416,0.6774988770484924,8.587454795837402,4.168490886688232,2.781977653503418,9.697319984436035,6.481685638427734,9.002985954284668,5.310872554779053,7.2310638427734375,2.9555206298828125,2.8136370182037354,1.9268455505371094,7.2455010414123535,2.407078504562378,2.7772626876831055,6.5514326095581055,9.87321949005127,4.4068522453308105,7.722829818725586,1.5783638954162598,6.975814342498779,2.000014305114746,8.334385871887207,1.5818378925323486,2.287403106689453,1.3232769966125488,8.119914054870605,1.3955495357513428,4.4739766120910645,3.0827810764312744,2.498081922531128,2.3724000453948975,8.173005104064941,5.187566757202148,1.0419682264328003,1.9750066995620728,4.8451738357543945,2.8975141048431396,3.5400514602661133,9.936842918395996,1.6597111225128174,8.560343742370605,4.284099102020264,9.177109718322754,3.2668814659118652,8.679408073425293,8.467524528503418,8.841562271118164,5.177658557891846,2.752577304840088,0.4872105121612549,7.051103115081787,4.049893379211426,7.550677299499512]}',
            "output":'[-79.62240600585938,-71.9732666015625,-107.995849609375,-28.628915786743164,-80.0647964477539,-20.647069931030273,-37.278472900390625,-27.939119338989258,-28.501792907714844,-79.62240600585938,-71.9732666015625,-107.995849609375,-28.628915786743164,-80.0647964477539,-20.647069931030273,-37.278472900390625,-27.939119338989258,-28.501792907714844,-79.62240600585938,-71.9732666015625,-107.995849609375,-28.628915786743164,-80.0647964477539,-20.647069931030273,-37.278472900390625,-27.939119338989258,-28.501792907714844,-79.62240600585938,-71.9732666015625,-107.995849609375,-28.628915786743164,-80.0647964477539,-20.647069931030273,-37.278472900390625,-27.939119338989258,-28.501792907714844]'

        }
            axios.post('http://yq01-paddle-mobile.epc.baidu.com:8088/uniTest', qs.stringify(params))
            .then(function (response) {
                if (response.status === 0) {
                    that.displayResult(response);
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    displayResult(res) {
        if (res.name) {
            console.log( $('.paddle-web-unit-list'));
            if (res.correct === 1) {

            }
            else if (res.correct === 0) {
                let serverData = res.server_data;
            }
        }
    },

// 释放资源
    dispose() {
        this.gpu.dispose();
    }
};
