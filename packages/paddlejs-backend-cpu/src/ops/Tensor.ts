import { JSON } from '../helper/json';
import {getIntArray, getFloatArray, getStr} from './utils';

function padToFourDimShape(shape: i32[]): i32[] {
    let fourDimShape = [] as i32[];
    if (shape.length === 4) {
        fourDimShape = shape;
    }
    else if (shape.length < 4) {
        for (let i = 0; i < 4 - shape.length; i++) {
            fourDimShape.push(1);
        }
        fourDimShape = fourDimShape.concat(shape);
    }
    return fourDimShape;
}

class Tensor {
    name: string = '';
    shape: i32[] = [];
    data: f32[] = [];
    tensorName: string = '';

    constructor(data: JSON.Obj) {
        this.name = getStr('name', data);
        this.tensorName = getStr('tensorName', data);
        this.shape = padToFourDimShape(getIntArray('shape', data));
        this.data = getFloatArray('data', data);
    }
}

class Attrs {
    strides: i32[] = [];
    paddings: i32[] = [];
    dilations: i32[] = [];
    constructor (data: JSON.Obj) {
        this.strides = getIntArray('strides', data);
        this.paddings = getIntArray('paddings', data);
        this.dilations = getIntArray('dilations', data);
    }
}

class TensorMap {
    filter: Tensor;
    origin: Tensor;
    bias: Tensor;
    out: Tensor;

    constructor() {
        const initialObj = new JSON.Obj();
        initialObj.set('name', '');
        initialObj.set('shape', []);
        initialObj.set('data', []);
        initialObj.set('tensorName', '');
        const initialTensor = new Tensor(initialObj);
        this.filter = initialTensor;
        this.origin = initialTensor;
        this.bias = initialTensor;
        this.out = initialTensor;
    }
}

export { Tensor, Attrs, TensorMap};

