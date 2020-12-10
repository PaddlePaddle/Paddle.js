import WebGPUBackend from './gpu';
import buildShader from './buildShader';
import {ops} from './ops';
import {registerOp, registerBackend} from 'paddlejs-core/src/index';


/* global GPUBufferUsage */

WebGPUBackend.prototype.createProgram = function (opts) {
    const {
        name,
        shaderParams
    } = opts;
    return buildShader(name, shaderParams);
};

WebGPUBackend.prototype.runProgram = function (type, opData, isRendered) {
    const iLayer = opData.iLayer;
    const outTensorIds = [];
    opData.inputTensors.forEach(tensor => {
        this.buildMappedBuffer(tensor, iLayer);
    });
    opData.outputTensors.forEach(tensor => {
        this.buildOutputBuffer(tensor, iLayer);
        outTensorIds.push(tensor.tensorId);
    });

    this.createBindGroupLayout(iLayer, outTensorIds);
    this.createComputePipeline(opData.program[0]);
    this.createBindGroup(iLayer, outTensorIds);
    this.execute(opData.outputTensors[0].shape_texture);
    this.submitEncodedCommands();
}

WebGPUBackend.prototype.read = async function (fetchInfo) {
    const fetchId = fetchInfo.name;
    const fetchShape = fetchInfo.shape;
    const fetchByteLength = fetchShape.reduce((acc, cur) => acc * cur, 1) * 4;
    this.createReadBuffer({
        size: fetchByteLength
    });
    this.copyBufferToBuffer(
        this.outputLayersMap[fetchId].buffer,
        this.readBuffer,
        0,
        0,
        fetchByteLength);
    return await this.readData();
};

const gpuInstance = new WebGPUBackend();

function registerWebGPUBackend() {
    registerBackend(
        'webgpu',
        gpuInstance
    );
    Object.keys(ops).forEach(key => {
        registerOp(ops[key], key);
    });
    return gpuInstance;
}

export default registerWebGPUBackend;
