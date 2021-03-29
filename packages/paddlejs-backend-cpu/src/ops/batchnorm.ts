import { Tensor } from './Tensor';
import { getFloat } from './utils';

class Attrs {
    epsilon: f32 = 0.001;
    paddings: i32[] = [];
    dilations: i32[] = [];
    constructor(data: Obj) {
        this.epsilon = getFloat('epsilon', data) || 0.001;
    }
}

function main(tensorMap: Map<string, Tensor>, attrs: Attrs, runtime: i32): f32[] {
    const scaleT = tensorMap.get('scale');
    const biasT = tensorMap.get('bias');
    const meanT = tensorMap.get('mean');
    const varianceT = tensorMap.get('variance');
    const origin = tensorMap.get('origin');
    const outT = tensorMap.get('out_' + runtime);

    const xLen = origin.total;
    const originWH = origin.shape[2] * origin.shape[3];
    const epsilon = attrs.epsilon;

    const scale = scaleT.data;
    const bias = biasT.data;
    const mean = meanT.data;
    const variance = varianceT.data;
    const x = origin.data;

    const outLen = outT.total;
    const result = new Array<f32>(outLen);

    let index = 0;
    let curGroup = 0;
    for (let i = 0; i < xLen; i++) {
        result[i] = f32((x[i] - mean[index]) / Math.sqrt(variance[index] + epsilon));
        result[i] = f32(scale[index] * result[i] + bias[index]);

        curGroup++;
        if (curGroup >= originWH) {
            curGroup = 0;
            index++;
        }
    }

    return result;
}

export {
    main,
    Attrs
};
