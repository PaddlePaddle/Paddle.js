import type Transformer from '../transform/transformer';

export enum BufferType {
    FrameBuffer = 'frameBuffer',
    ColorBuffer = 'colorBuffer'
}

export interface ModelOp {
    type: string;
    attrs?: OpAttrs;
    'sub-attrs'?: OpAttrs[];
    inputs: OpInputs;
    outputs: OpOutputs;
    isPacked?: boolean;
    bufferType?: BufferType;
    uniform?: OpUniform | null;
    scale?: number[];
    pos?: number[];
    shape?: number[];
    name?: string;
}

export interface ModelVar {
    name: string;
    shape: number[];
    data?: number[] | Float32Array;
    persistable?: boolean;
    tensorName?: string;
    interpType?: string;
    packed?: boolean;
    total?: number;
    runtime?: number;
}

export enum WasmMemoryType {
    memory100 = '100',
    memory200 = '200',
    memory300 = '300',
    memory400 = '400',
    memory500 = '500',
    memory600 = '600',
    memory700 = '700',
    memory800 = '800',
    memory900 = '900',
}
export interface Model {
    chunkNum?: number;
    feedShape?: FeedShape | null;
    dataLayout?: string;
    ops: ModelOp[];
    vars: ModelVar[];
    multiOutputs?: ModelOp[];
    postOps?: ModelOp[];
    index?: number;
}

export interface FeedShape {
    fc?: number;
    fw: number;
    fh: number;
};

interface ModelObj {
    model: Model;
    params: Float32Array
}
export interface RunnerConfig {
    modelPath?: string;
    modelObj?: ModelObj;
    modelName?: string;
    feedShape?: FeedShape;
    fill?: string; // 缩放后用什么颜色填充不足方形部分
    mean?: number[];
    std?: number[];
    bgr?: boolean;
    type?: GraphType; // model type
    keepRatio?: boolean;
    needPreheat?: boolean;
    plugins?: { // tranform graph plugins
        preTransforms?: Transformer[]; // before creating graph
        transforms?: Transformer[]; // while traversing the ops map
        postTransforms?: Transformer[]; // after creating graph
    };
    wasmMemoryType?: WasmMemoryType;
    index?: number; // the index of model
    dataLayout?: string;
    multiOutputs?: ModelOp[];
    postOps?: ModelOp[];
    webglFeedProcess?: boolean; // to convert all pre-processing parts of the model to shader processing, and keep the original image
}
export interface OpInputs {
    [key: string]: any;
}

export interface OpOutputs {
    [key: string]: any;
}

export interface OpAttrs {
    [key: string]: any;
}

export enum UniformType {
    uniform1f = '1f',
    uniform1fv = '1fv',
    uniform1i = '1i',
    uniform1iv = '1iv',
    uniform2f = '2f',
    uniform2fv = '2fv',
    uniform2i = '2i',
    uniform2iv = '2iv',
    uniform3f = '3f',
    uniform3fv = '3fv',
    uniform3i = '3i',
    uniform3iv = '3iv',
    uniform4f = '4f',
    uniform4fv = '4fv',
    uniform4i = '4i',
    uniform4iv = '4iv'
}

export enum GraphType {
    SingleOutput = 'single',
    MultipleOutput = 'multiple',
    MultipleInput = 'multipleInput'
}
export interface OpUniform {
    [key: string]: {
        type: UniformType,
        value: number | Array<number> | Int32Array | Float32Array
    };
}
export interface OpExecutor {
    id: string;
    type: string;
    inputs: OpInputs;
    outputs: OpOutputs;
    attrs: OpAttrs;
    subAttrs: OpAttrs[];
    next: string | null;
    opData: OpData;
    isPacked: boolean;
    finish: boolean;
    inputsName: string[];
    outputsName: string[];
    execute: Function;
    bufferType?: BufferType;
    uniform?: OpUniform | null;
}

interface Behavior {
    [key: string]: Function;
}

export interface OpInfo {
    params?: string[] | Function;
    main?: Function | string;
    mainFunc?: Function;
    textureFuncConf?: {
        [key: string]: string[];
    },
    commonFuncConf?: string[];
    name?: string;
    conf?: object;
    main_packed?: string;
    behavior?: Behavior;
    behaviors?: string[];
}

export interface Ops {
    // key => backend_name
    [key: string]: OpInfo;
}

export interface OpData {
    name: string;
    realName: string;
    isPackedOp: boolean;
    bufferType: BufferType;
    input: OpInputs;
    output: OpOutputs;
    attrs: any;
    subAttrs: object[];
    data: AttrsData;
    inputTensors: any;
    outputTensors: any;
    fShaderParams: any;
    vars: ModelVar[];
    iLayer: number;
    program: any;
    tensorData: any[];
    modelName: string;
    uniform: OpUniform | null;
}


export interface AttrsData {
    [key: string]: any;
}


export interface InputFeed {
    data: Float32Array | number[];
    shape: number[];
    name: string;
    persistable?: boolean;
}
