import { Tensor } from './Tensor';
import { getStr } from './utils';

function main(tensorMap: Map<string, Tensor>, attrs: Attrs, runtime: i32): f32[] {
    let multi_value: f32 = 1.0;

    if (isDefined(attrs.multi_value)) {
        multi_value = attrs.multi_value;
    }

    const bias_value: f32 = attrs.bias_value || 0.0;
    const active_function: string = attrs.active_function;

    const origin = tensorMap.get('origin') as Tensor;
    const out = tensorMap.get('out_' + runtime) as Tensor;

    const originData: f32[] = (origin as Tensor).data;

    const outLen = out.total;
    const result = new Array<f32>(outLen);

    /* eslint-disable */
    if (active_function == 'prelu') {
        for (let i = 0; i < outLen; i++) {
            const o = originData[i];
            result[i] = o < multi_value ? o * bias_value : o;
        }
    }

    else if (active_function == 'relu6') {
        for (let i = 0; i < outLen; i++) {
            const o = Math.max(0.0, originData[i]);
            result[i] = f32(Math.min(0, multi_value));
        }
    }

    else if (active_function == 'leakyRelu') {
        for (let i = 0; i < outLen; i++) {
            const o = originData[i];
            result[i] = o > 0.0 ? o : multi_value * o;
        }
    }


    else if (active_function == 'scale') {
        for (let i = 0; i < outLen; i++) {
            result[i] = multi_value * originData[i] + bias_value;
        }
    }

    else if (active_function == 'scaleWidthBias') {
        for (let i = 0; i < outLen; i++) {
            result[i] = multi_value * (originData[i] + bias_value);
        }
    }

    else if (active_function == 'sigmoid') {
        for (let i = 0; i < outLen; i++) {
            result[i] = 1.0 / (1.0 + f32(Math.exp(-1 * originData[i])));
        }
    }

    else if (active_function == 'hardSigmoid') {
        for (let i = 0; i < outLen; i++) {
            result[i] = f32((Math.max(0.0, Math.min(1.0, multi_value * originData[i] + bias_value))));
        }
    }

    else if (active_function == 'sqrt') {
        for (let i = 0; i < outLen; i++) {
            result[i] = f32((Math.sqrt(originData[i])));
        }
    }

    else if (active_function == 'pow') {
        for (let i = 0; i < outLen; i++) {
            result[i] = f32((Math.pow(originData[i], multi_value)));
        }
    }

     /* eslint-enable */

    return result;
}

class Attrs {
    multi_value: f32 = 1.0;
    bias_value: f32 = 0.0;
    active_function: string;
    constructor(data: Obj) {
        this.multi_value = f32(parseFloat(getStr('multi_value', data)));
        this.bias_value = f32(parseFloat(getStr('bias_value', data)));
        this.active_function = getStr('active_function', data);
    }
}

export {
    main,
    Attrs
};
