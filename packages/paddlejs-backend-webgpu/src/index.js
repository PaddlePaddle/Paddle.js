import WebGPUBackend from './gpu';
import buildShader from './buildShader';
import ops from './ops';

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

WebGPUBackend.prototype.read = async function (fetchOp) {
    const fetchId = fetchOp.opData.outputTensors[0].tensorId;
    const fetchShape = fetchOp.opData.outputTensors[0].shape;
    const fetchByteLength = fetchShape.reduce((acc, cur) => acc * cur, fetchShape[0]) * 4;
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
export {
    ops,
    gpuInstance
};
