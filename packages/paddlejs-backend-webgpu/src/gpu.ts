/**
 * @file webgpu 计算
 * @author zhangjingyuan
 */

// / <reference types="@webgpu/types" />

import { PaddlejsBackend } from '@paddlejs/paddlejs-core';
import glslangModule from '@webgpu/glslang/dist/web-devel/glslang.onefile';
import type { Glslang } from '@webgpu/glslang/dist/web-devel/glslang.onefile';
import buildShader from './buildShader';


/* global GPUMapMode, GPUShaderStage, GPUBufferUsage, navigator */

interface BufferMap {
    [key: string]: {
        buffer: GPUBuffer;
        binding: number;
    }
}

export default class WebGPUBackend extends PaddlejsBackend {
    device: GPUDevice = null as unknown as GPUDevice;
    glslang: Glslang = null as unknown as Glslang;
    queue: GPUQueue = null as unknown as GPUQueue;
    pipeline: GPUComputePipeline = null as unknown as GPUComputePipeline;
    encoder: GPUCommandEncoder = null as unknown as GPUCommandEncoder;
    bindGroupLayout: GPUBindGroupLayout = null as unknown as GPUBindGroupLayout;
    bindGroup: GPUBindGroup = null as unknown as GPUBindGroup;
    readBuffer: GPUBuffer = null as unknown as GPUBuffer;

    commandQueue: GPUCommandEncoder[] = [];
    inputLayersMap: BufferMap = {};
    outputLayersMap: BufferMap = {};

    constructor() {
        super();
    }

    async init() {
        if (!this.device) {
            // @ts-ignore
            const adapter = await navigator.gpu.requestAdapter() as GPUAdapter;
            this.device = await adapter.requestDevice() as GPUDevice;
        }
        if (!this.queue) {
            this.queue = this.device.defaultQueue;
        }
        if (this.glslang) {
            return;
        }
        const glslang = await glslangModule();
        this.glslang = glslang;
    }

    buildMappedBuffer(tensor) {
        const tensorId = tensor.tensorId;
        if (tensor.data && this.inputLayersMap[tensorId]) {
            return;
        }
        else if (!tensor.data) {
            this.inputLayersMap[tensorId] = {
                buffer: this.outputLayersMap[tensorId].buffer,
                binding: tensor.binding
            };
            return;
        }
        const tensorByteLength = tensor.data.byteLength;
        this.createBufferMapped({
            size: tensorByteLength,
            data: tensor.data,
            binding: tensor.binding,
            tensorId
        });
    }

    createBufferMapped({
        size,
        data,
        binding,
        tensorId
    }) {
        const gpuMappedBufferMatrix = this.device.createBuffer({
            mappedAtCreation: true,
            size,
            usage: GPUBufferUsage.STORAGE
        });
        const arrayBufferMatrix = gpuMappedBufferMatrix.getMappedRange();
        if (data) {
            this.inputLayersMap[tensorId] = {
                buffer: gpuMappedBufferMatrix,
                binding
            };
        }
        new Float32Array(arrayBufferMatrix).set(data);
        gpuMappedBufferMatrix.unmap();
    }

    buildOutputBuffer(tensor) {
        const tensorId = tensor.tensorId;
        const tensorByteLength = tensor.shape.reduce((acc, cur) => acc * cur, tensor.shape[0]) * 4;
        this.createBuffer({
            size: tensorByteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            binding: tensor.binding,
            tensorId
        });
    }

    createBuffer({
        size,
        usage,
        binding,
        tensorId
    }) {
        const resultMatrixBuffer = this.device.createBuffer({
            size,
            usage: usage || GPUBufferUsage.STORAGE
        });
        this.outputLayersMap[tensorId] = {
            buffer: resultMatrixBuffer,
            binding
        };
    }

    createReadBuffer({
        size
    }) {
        this.readBuffer = this.device.createBuffer({
            size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
    }

    createBindGroupLayout(inputTensorIds, outTensorIds) {
        const buffersKeys = [...inputTensorIds, ...outTensorIds];
        const formattedEntries = buffersKeys.map(key => {
            if (this.inputLayersMap[key]) {
                return {
                    binding: this.inputLayersMap[key].binding,
                    visibility: GPUShaderStage.COMPUTE,
                    type: 'readonly-storage-buffer'
                };
            }
            return {
                binding: this.outputLayersMap[key].binding,
                visibility: GPUShaderStage.COMPUTE,
                type: 'storage-buffer'
            };
        });

        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: formattedEntries as any
        });
    }

    createBindGroup(inputTensorIds, outTensorIds) {
        const buffersKeys = [...inputTensorIds, ...outTensorIds];
        const entries = buffersKeys.map(key => {
            const input = this.inputLayersMap[key];
            if (input) {
                return {
                    binding: input.binding,
                    resource: {
                        buffer: input.buffer
                    }
                };
            }
            return {
                binding: this.outputLayersMap[key].binding,
                resource: {
                    buffer: this.outputLayersMap[key].buffer
                }
            };
        });
        const bindGroup = this.device.createBindGroup({
            layout: this.bindGroupLayout,
            entries
        });
        this.bindGroup = bindGroup;
    }

    createComputePipeline(computeShaderCode) {
        const computePipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayout]
            }),
            computeStage: {
                module: this.device.createShaderModule({
                    code: this.glslang.compileGLSL(computeShaderCode, 'compute', true)
                }),
                entryPoint: 'main'
            }
        });
        this.pipeline = computePipeline;
    }

    execute(outputShape) {
        this.encoder = this.device.createCommandEncoder();
        const passEncoder = this.encoder.beginComputePass();
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.bindGroup);
        passEncoder.dispatch(outputShape[outputShape.length - 2], outputShape[outputShape.length - 1]);
        passEncoder.endPass();
    }

    copyBufferToBuffer(srcBuffer, destBuffer, srcOffset = 0, destOffset = 0, destSize = 0) {
        const encoder = this.device.createCommandEncoder();
        encoder.copyBufferToBuffer(
            srcBuffer /* source buffer */,
            srcOffset /* source offset */,
            destBuffer /* destination buffer */,
            destOffset /* destination offset */,
            destSize /* size */
        );
        const copyCommands = encoder.finish();
        this.queue.submit([copyCommands]);
    }

    submitEncodedCommands() {
        const copyCommands = this.encoder.finish();
        this.queue.submit([copyCommands]);
    }

    dispose() {
        this.commandQueue = [];
        this.outputLayersMap = {};
    }

    async readData() {
        await this.readBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = this.readBuffer.getMappedRange();
        this.dispose();
        return new Float32Array(copyArrayBuffer);
    }

    createProgram({
        name,
        runtime,
        shaderParams
    }) {
        return buildShader(name, {
            ...shaderParams,
            runtime
        });
    }

    runProgram({
        inputTensors,
        outputTensors,
        program
    }) {
        const outTensorIds: string[] = [];
        const inputTensorIds: string[] = [];
        inputTensors.forEach(tensor => {
            this.buildMappedBuffer(tensor);
            inputTensorIds.push(tensor.tensorId);
        });
        outputTensors.forEach(tensor => {
            this.buildOutputBuffer(tensor);
            outTensorIds.push(tensor.tensorId);
        });
        program.forEach((shader, index) => {
            this.createBindGroupLayout(inputTensorIds, outTensorIds);
            this.createComputePipeline(shader);
            this.createBindGroup(inputTensorIds, outTensorIds);
            this.execute(outputTensors[index].shape_texture);
            this.submitEncodedCommands();
        });
    }

    async read(fetchInfo) {
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
    }

}
