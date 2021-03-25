import { Tensor } from './Tensor';
import { getInt, getFloat } from './utils';

function main(tensorMap: Map<string, Tensor>, attrs: Attrs): f32[] {
    const origin = tensorMap.get('origin') as Tensor;
    const counter = tensorMap.get('counter') as Tensor;
    const out = tensorMap.get('out') as Tensor;

    const outShape: i32[] = (out as Tensor).shape;

    const originReducedShape: i32[] = (origin as Tensor).shapeReduced;
    const counterReducedShape: i32[] = (counter as Tensor).shapeReduced;
    const outReducedShape: i32[] = (out as Tensor).shapeReduced;

    const originS0 = originReducedShape[0];
    const originS1 = originReducedShape[1];
    const originS2 = originReducedShape[2];

    const counterS0 = counterReducedShape[0];
    const counterS1 = counterReducedShape[1];
    const counterS2 = counterReducedShape[2];

    const outS0 = outReducedShape[0];
    const outS1 = outReducedShape[1];
    const outS2 = outReducedShape[2];

    const originData: f32[] = (origin as Tensor).data;
    const counterData: f32[] = (counter as Tensor).data;

    const axis = attrs.axis;
    const Scale_x = attrs.Scale_x || 1.0;
    const Scale_y = attrs.Scale_y || 1.0;
    const Scale_out = attrs.Scale_out || 1.0;

    const outB = outShape[0];
    const outC = outShape[1];
    const outH = outShape[2];
    const outW = outShape[3];

    const result = new Array<f32>(out.total);

    for (let n = 0; n < outB; n++) {
        const n1 = axis > 0 ? 0 : n;
        for (let c = 0; c < outC; c++) {
            const c1 = axis > 1 ? 0 : c;
            for (let h = 0; h < outH; h++) {
                const h1 = axis > 2 ? 0 : h;
                for (let w = 0; w < outW; w++) {
                    const w1 = axis > 3 ? 0 : w;

                    const a = originData[n * originS0 + c * originS1 + h * originS2 + w];
                    const b = counterData[n1 * counterS0 + c1 * counterS1 + h1 * counterS2 + w1];
                    const res: f32 = (Scale_out / Scale_y) * b + (Scale_out / Scale_x) * a;

                    result[n * outS0 + c * outS1 + h * outS2 + w] = res;
                }
            }
        }
    }

    return result;
}

class Attrs {
    axis: i32;
    Scale_x: f32 = 1.0;
    Scale_y: f32 = 1.0;
    Scale_out: f32 = 1.0;
    constructor(data: Obj) {
        this.axis = getInt('axis', data);
        this.Scale_x = getFloat('Scale_x', data);
        this.Scale_y = getFloat('Scale_y', data);
        this.Scale_out = getFloat('Scale_out', data);
    }
}

const behaviors = [
    'processAxis'
];

const inputsName = [
    'X',
    'Y'
];

export {
    main,
    Attrs,
    behaviors,
    inputsName
};