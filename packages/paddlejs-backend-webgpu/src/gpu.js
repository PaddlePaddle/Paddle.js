/**
 * @file webgpu 计算
 * @author zhangjingyuan02
 */
 /* globals GPUMapMode GPUShaderStage */
 export default class WebGPUBackend {
    constructor() {
        this.queue = null;
        this.commandQueue = [];
        this.encoder = null;
        this.bindGroupLayout = null;
        this.bindGroup = null;
        this.pipeline = null;
        this.size = 4;
        this.usage = GPUBufferUsage.STORAGE;
        // this.inputBuffers = [];
        // this.outputBuffers = [];
        this.inputLayersMap = {};
        this.outputLayersMap = {};
        this.readBuffer = null;
        this.device = null;
        this.glslang = null;
        this.querySet = null;
    }
    async init() {
        if (!this.device) {
            const adapter = await navigator.gpu.requestAdapter();
            this.device = await adapter.requestDevice();
        }
        if (!this.queue) {
            this.queue = this.device.defaultQueue;
        }
        if (this.glslang) return this.glslang;
        const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.15/dist/web-devel/glslang.js');
        const glslang = await glslangModule.default();
        this.glslang = glslang;
    }
    buildMappedBuffer(tensor, iLayer) {
        const tensorId = tensor.tensorId;
        if (tensor.data && this.inputLayersMap[`${iLayer}`] && this.inputLayersMap[`${iLayer}`][tensorId]) {
            return;
        }
        else if (!tensor.data) {
            this.inputLayersMap[`${iLayer}`] = this.inputLayersMap[`${iLayer}`] || {};
            this.inputLayersMap[`${iLayer}`][tensorId] = {
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
            iLayer,
            tensorId
        });
    }
    createBufferMapped({size, usage, data, binding, iLayer, tensorId}) {
        const gpuMappedBufferMatrix = this.device.createBuffer({
            mappedAtCreation: true,
            size: size || this.size,
            usage: this.usage
        });
        const arrayBufferMatrix = gpuMappedBufferMatrix.getMappedRange();
        if (data) {
            this.inputLayersMap[`${iLayer}`] = this.inputLayersMap[`${iLayer}`] || {};
            this.inputLayersMap[`${iLayer}`][`${tensorId}`] = {
                buffer: gpuMappedBufferMatrix,
                binding
            };
        }
        // this.inputBuffers.push({
        //     buffer: gpuMappedBufferMatrix,
        //     binding
        // });
        new Float32Array(arrayBufferMatrix).set(data);
        gpuMappedBufferMatrix.unmap();
    }
    buildOutputBuffer(tensor, iLayer) {
        const tensorId = tensor.tensorId;
        const tensorByteLength = tensor.shape.reduce((acc, cur) => acc * cur, tensor.shape[0]) * 4;
        this.createBuffer({
            size: tensorByteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            binding: tensor.binding,
            iLayer,
            tensorId
        });
    }
    createBuffer({size, usage, binding, iLayer, tensorId}) {
        const resultMatrixBuffer = this.device.createBuffer({
            size: size || this.size,
            usage: usage || this.usage
        });
        this.outputLayersMap[`${tensorId}`] = {
            buffer: resultMatrixBuffer,
            binding
        };
        // this.outputBuffers.push({
        //     buffer: resultMatrixBuffer,
        //     binding
        // });
    }
    createReadBuffer({size}) {
        this.readBuffer = this.device.createBuffer({
            size: size || this.size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
    }
    createBindGroupLayout(iLayer, outTensorIds) {
        const buffersKeys = [...Object.keys(this.inputLayersMap[`${iLayer}`]), ...outTensorIds];
        const formattedEntries = buffersKeys.map(key => {
            if (this.inputLayersMap[`${iLayer}`][key]) {
                return {
                    binding: this.inputLayersMap[`${iLayer}`][key].binding,
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
        // const buffers = [...this.inputBuffers, ...this.outputBuffers];
        // const formattedEntries = buffers.map((item, index) => {
        //     return {
        //         binding: item.binding,
        //         visibility: GPUShaderStage.COMPUTE,
        //         type: index < this.inputBuffers.length - 1 ? 'readonly-storage-buffer' : 'storage-buffer'
        //     };
        // });
        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: formattedEntries
        });
    }
    createBindGroup(iLayer, outTensorIds) {
        const buffersKeys = [...Object.keys(this.inputLayersMap[`${iLayer}`]), ...outTensorIds];
        const entries = buffersKeys.map(key => {
            const input = this.inputLayersMap[`${iLayer}`][key];
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
        // const bindGroup = this.device.createBindGroup({
        //     layout: this.bindGroupLayout,
        //     entries: [...this.inputBuffers, ...this.outputBuffers].map((item, index) => {
        //         return {
        //             binding: item.binding,
        //             resource: {
        //                 buffer: item.buffer
        //             }
        //         };
        //     })
        // });
        this.bindGroup = bindGroup;
    }
    createComputePipeline(computeShaderCode) {
        const computePipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayout]
            }),
            computeStage: {
                module: this.device.createShaderModule({
                    code: this.glslang.compileGLSL(computeShaderCode, 'compute')
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
    copyBufferToBuffer(srcBuffer, destBuffer, srcOffset = 0, destOffset = 0, destSize) {
        const encoder = this.device.createCommandEncoder({});
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
        this.bindGroupLayout = null;
        this.bindGroup = null;
        this.pipeline = null;
        this.encoder = null;
        // this.inputLayersMap = {};
        this.outputLayersMap = {};
        // this.inputBuffers = [];
        // this.outputBuffers = [];
        this.readBuffer = null;
    }
    async readData() {
        await this.readBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = this.readBuffer.getMappedRange();
        this.dispose();
        return new Float32Array(copyArrayBuffer);
    }
}
