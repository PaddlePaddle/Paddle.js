/**
 * @file fuse ops
 */

import * as func from './common_func';

interface OpParams {
    fuse_opt?: {
        scale?: {
            scale?: number;
            bias_after_scale?: boolean;
            bias?: number;
        };
        hardSigmoid?: {
            slope?: number;
            offset?: number;
        };
        relu6?: {
            threshold?: number;
        };
        pow?: {
            factor?: number;
        };
        leakyRelu?: {
            alpha: number;
        };
        sigmoid?: {};
        prelu?: {};
        sqrt?: {};
        tanh?: {};
        hard_swish?: {
            offset?: number;
            scale?: number;
            threshold?: number;
        };
        dropout?: {
            dropout_implementation: string;
            dropout_prob: number;
        }
    }
}

export default function genFuseOpCode(params: OpParams) {
    let activation_func = '';
    let calculation_str = '';

    if (params.fuse_opt) {
        for (const fuse in params.fuse_opt) {
            let act_name = fuse;
            let multi_value = 0;
            let bias_value = 0;

            switch (fuse) {
                case 'scale': {
                    const bias_after_scale = params.fuse_opt.scale.bias_after_scale;
                    const scale = params.fuse_opt.scale.scale;
                    multi_value = scale !== undefined ? scale : 1;
                    bias_value = params.fuse_opt.scale.bias || 0;
                    if (bias_after_scale === false && bias_after_scale !== undefined) {
                        act_name = 'scaleWidthBias';
                    }
                    break;
                }

                case 'relu':
                    act_name = 'prelu';
                    break;

                case 'relu6':
                    multi_value = params.fuse_opt[fuse].threshold;
                    break;

                case 'hard_sigmoid':
                    act_name = 'hardSigmoid';
                    multi_value = params.fuse_opt[fuse].slope || 0.2;
                    bias_value = params.fuse_opt[fuse].offset || 0.5;
                    break;

                case 'leakyRelu':
                    multi_value = params.fuse_opt[fuse].alpha;
                    break;

                case 'pow':
                    act_name = 'pow_func';
                    multi_value = params.fuse_opt[fuse].factor || 2;
                    break;

                case 'tanh':
                    act_name = 'tanh_func';
                    break;

                default:
                    break;
            }

            if (fuse === 'hard_swish') {
                const offset = params.fuse_opt.hard_swish.offset !== undefined
                    ? params.fuse_opt.hard_swish.offset
                    : 3;
                const scale = params.fuse_opt.hard_swish.scale !== undefined
                    ? params.fuse_opt.hard_swish.scale
                    : 6;
                const threshold = params.fuse_opt.hard_swish.threshold !== undefined
                    ? params.fuse_opt.hard_swish.threshold
                    : 6;
                // eslint-disable-next-line max-len
                calculation_str += `res = res * min(max(0.0, res + float(${offset})), float(${threshold})) / float(${scale});`;
            }
            else if (fuse === 'dropout') {
                const dropout_implementation = params.fuse_opt.dropout.dropout_implementation;
                const dropout_prob = params.fuse_opt.dropout.dropout_prob;
                calculation_str += `
                if (${dropout_implementation === 'downgrade_in_infer'}) {
                    res = res * (1.0 - float(${dropout_prob}));
                }`;
            }
            else {
                activation_func += func[act_name];
                calculation_str += `res = ${act_name}(res, float(${multi_value}), float(${bias_value}));`;
            }
        }
    }

    return `
        ${activation_func}
        
        float fuse_op(float x) {
            float res = x;
            ${calculation_str}
            return res;
        }
    `;
}
