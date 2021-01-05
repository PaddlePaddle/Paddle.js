export interface ModelOp {
    type: string;
    attrs?: OpAttrs;
    'sub-attrs'?: OpAttrs[];
    inputs: OpInputs;
    outputs: OpOutputs;
}

export interface ModelVar {
    name: string;
    shape: number[];
    data?: number[] | Float32Array;
    persistable?: boolean;
    tensorName?: string;
}

export interface Model {
    ops: ModelOp[];
    vars: ModelVar[];
}

export interface OpInputs {
    [key: string]: any;
}

export interface OpOutputs {
    [key: string]: any;
}

export interface OpAttrs {
    [key: string]: any
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
}

interface Behavior {
    [key: string]: Function;
}

export interface OpInfo {
    params: string[] | Function;
    main?: string;
    mainFunc?: Function;
    textureFuncConf?: {
        [key: string]: string[];
    },
    name?: string;
    conf?: object;
    inputsName?: string[];
    outputsName?: string[];
    main_packed?: string;
    behavior?: Behavior;
    behaviors?: string[];
}


export interface OpData {
    name: string;
    realName: string;
    isPackedOp: boolean;
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
    renderData: any[];
    tensorData: any[];
}


export interface AttrsData {
    [key: string]: any
}


export interface InputFeed {
    data: Float32Array | number[];
    shape: number[];
    name: string;
}
