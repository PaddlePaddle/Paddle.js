import { Tensor } from './Tensor';
import { getInt } from './utils';

/* eslint-disable max-statements */
function main(tensorMap: Map<string, Tensor>, attrs: Attrs): f32[] {
    let axis = attrs.axis; ;
    if (!axis || axis < 0) {
        axis = (axis || -1) + 4;
    }

    const origin = tensorMap.get('origin') as Tensor;
    const out = tensorMap.get('out') as Tensor;

    const originShape: i32[] = (origin as Tensor).shape;
    const outShape: i32[] = (out as Tensor).shape;

    const originReducedShape: i32[] = (origin as Tensor).shapeReduced;
    const outReducedShape: i32[] = (out as Tensor).shapeReduced;

    const originData: f32[] = (origin as Tensor).data;

    const outB = outShape[0];
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

    let total: f32 = 0.0;
    const limit: i32 = originShape[axis];

    for (let n = 0; n < outB; n++) {
        for (let c = 0; c < outC; c++) {
            for (let h = 0; h < outH; h++) {
                for (let w = 0; w < outW; w++) {
                    const originIndex: i32[] = [n, c, h, w];
                    originIndex[axis] = 0;

                    for (let i = 0; i < limit; i++) {
                        const tmp = originData[originIndex[0] * originS0
                            + originIndex[1] * originS1
                            + originIndex[2] * originS2
                            + originIndex[3]];
                        total += f32(Math.exp(tmp));
                        originIndex[axis]++;
                    }

                    const o = originData[n * originS0 + c * originS1 + h * originS2 + w];
                    result[n * outS0 + c * outS1 + h * outS2 + w] = f32(Math.exp(o)) / total;

                    total = 0.0;
                }
            }
        }
    }

    return result;
}
/* eslint-enable max-statements */

class Attrs {
    axis: i32;
    constructor(data: Obj) {
        this.axis = getInt('axis', data);
    }
}

const behaviors = [
];

export {
    main,
    Attrs,
    behaviors
};