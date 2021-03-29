import { Tensor } from './Tensor';
import { getInt } from './utils';

class Attrs {
    axis: i32;
    num: i32;
    constructor(data: Obj) {
        this.axis = getInt('axis', data);
        this.num = getInt('num', data);
    }
}

/* eslint-disable max-statements */
function main(tensorMap: Map<string, Tensor>, attrs: Attrs, runtime: i32): f32[] {
    let axis = attrs.axis;
    if (!axis || axis < 0) {
        axis = (axis || -1) + 4;
    }

    const origin = tensorMap.get('origin') as Tensor;
    const out = tensorMap.get('out_' + runtime) as Tensor;
    const length = origin.shape[axis] / attrs.num;

    const outShape: i32[] = (out as Tensor).shape;
    const startIndex = out.runtime * length;
    const originReducedShape: i32[] = (origin as Tensor).shapeReduced;
    const outReducedShape: i32[] = (out as Tensor).shapeReduced;

    const originData: f32[] = (origin as Tensor).data;

    const outN = outShape[0];
    const outC = outShape[1];
    const outH = outShape[2];
    const outW = outShape[3];

    const originS0 = originReducedShape[0];
    const originS1 = originReducedShape[1];
    const originS2 = originReducedShape[2];

    const outS0 = outReducedShape[0];
    const outS1 = outReducedShape[1];
    const outS2 = outReducedShape[2];

    const result = new Array<f32>(out.total);

    for (let n = 0; n < outN; n++) {
        for (let c = 0; c < outC; c++) {
            for (let h = 0; h < outH; h++) {
                for (let w = 0; w < outW; w++) {
                    const s = [n, c, h, w];
                    s[axis] = s[axis] + startIndex;
                    result[n * outS0 + c * outS1 + h * outS2 + w]
                        = originData[s[0] * originS0 + s[1] * originS1 + s[2] * originS2 + s[3]];
                }
            }
        }
    }
    return result;
}
/* eslint-enable max-statements */

const behaviors = [];

export {
    main,
    Attrs,
    behaviors
};