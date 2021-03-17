import { Tensor } from './Tensor';
import { getIntArray, getBool } from './utils';

/* eslint-disable max-statements, max-depth */
function main(tensorMap: Map<string, Tensor>, attrs: Attrs): f32[] {
    const origin = tensorMap.get('origin') as Tensor;
    const filter = tensorMap.get('filter') as Tensor;
    const out = tensorMap.get('out') as Tensor;
    const bias = tensorMap.get('bias') as Tensor;

    const originShape: i32[] = (origin as Tensor).shape;
    const filterShape: i32[] = (filter as Tensor).shape;
    const outShape: i32[] = (out as Tensor).shape;

    const originReducedShape: i32[] = (origin as Tensor).shapeReduced;
    const filterReducedShape: i32[] = (filter as Tensor).shapeReduced;
    const outReducedShape: i32[] = (out as Tensor).shapeReduced;

    const originData: f32[] = (origin as Tensor).data;
    const filterData: f32[] = (filter as Tensor).data;
    const biasData: f32[] = (bias as Tensor).data;

    const strides = attrs.strides;
    const paddings = attrs.paddings;
    const dilations = attrs.dilations;
    const fuse_relu = attrs.fuse_relu;

    const stride_v = strides[0] || 1;
    const stride_h = strides[1] || 1;
    const dilation_v = dilations[0] || 1;
    const dilation_h = dilations[1] || 1;
    const padTop = paddings[0] || 0;
    const padLeft = paddings[1] || 0;

    const outB = outShape[0];
    const outC = outShape[1];
    const outH = outShape[2];
    const outW = outShape[3];

    const filterH = filterShape[2];
    const filterW = filterShape[3];

    const originH = originShape[2];
    const originW = originShape[3];

    const result = new Array<f32>(out.total);

    const filterS0 = filterReducedShape[0];
    const filterS2 = filterReducedShape[2];

    const originS0 = originReducedShape[0];
    const originS1 = originReducedShape[1];
    const originS2 = originReducedShape[2];

    const outS0 = outReducedShape[0];
    const outS1 = outReducedShape[1];
    const outS2 = outReducedShape[2];

    let res: f32 = 0.0;
    let bi: f32 = 0.0;
    let oyBase: i32 = 0;
    let oxBase: i32 = 0;
    let oy: i32 = 0;
    let ox: i32 = 0;
    let f: f32 = 0.0;
    let o: f32 = 0.0;

    for (let n = 0; n < outB; n++) {
        for (let c = 0; c < outC; c++) {
            bi = biasData[c];
            for (let h = 0; h < outH; h++) {
                for (let w = 0; w < outW; w++) {
                    res = 0.0;
                    oyBase = h * stride_v - padTop;

                    for (let fy = 0; fy < filterH; fy++) {
                        oy = oyBase + fy * dilation_v;
                        if (oy >= originH) {
                            break;
                        }
                        if (oy < 0) {
                            continue;
                        }

                        oxBase = w * stride_h - padLeft;

                        for (let fx = 0; fx < filterW; fx++) {
                            ox = oxBase + fx * dilation_h;
                            if (ox >= originW) {
                                break;
                            }
                            if (ox < 0) {
                                continue;
                            }

                            f = filterData[c * filterS0 + fy * filterS2 + fx];
                            o = originData[n * originS0 + c * originS1 + oy * originS2 + ox];

                            res += f * o;
                            ox += dilation_h;
                        }

                        oy += dilation_v;
                    }

                    res += bi;
                    result[n * outS0 + c * outS1 + h * outS2 + w] = res;
                }
            }
        }
    }

    if (fuse_relu) {
        for (let i = 0; i < out.total; i++) {
            result[i] = f32(Math.max(0.0, result[i]));
        }
    }

    return result;
}
/* eslint-enable max-statements */

class Attrs {
    strides: i32[] = [];
    paddings: i32[] = [];
    dilations: i32[] = [];
    fuse_relu: bool;
    constructor(data: Obj) {
        this.strides = getIntArray('strides', data);
        this.fuse_relu = getBool('fuse_relu', data);
        this.paddings = getIntArray('paddings', data);
        this.dilations = getIntArray('dilations', data);
    }
}

const behaviors = [
];

export {
    main,
    Attrs,
    behaviors
};