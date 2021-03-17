import { getIntArray, getFloatArray, getStr, getInt, reduceShape } from './utils';

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
    shapeReduced: i32[] = [];
    data: f32[] = [];
    tensorName: string = '';
    total: i32 = 0;

    constructor(data: Obj) {
        this.name = getStr('name', data);
        this.tensorName = getStr('tensorName', data);
        this.shape = padToFourDimShape(getIntArray('shape', data));
        this.shapeReduced = reduceShape(this.shape);
        this.data = getFloatArray('data', data);
        this.total = getInt('total', data);
    }
}


export { Tensor, padToFourDimShape };

