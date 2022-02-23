/**
 * @file fuse ops
 */

import * as func from './common_func';

interface OutParams {
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
    }
}

export default function genFuseOpCode(params: OutParams) {
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
                    multi_value = params.fuse_opt.scale.scale || 0;
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
            activation_func += func[act_name];
            calculation_str += `res = ${act_name}(x, float(${multi_value}), float(${bias_value}));`;
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
