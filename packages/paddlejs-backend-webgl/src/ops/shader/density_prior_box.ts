/**
 * @file density_prior_box
 */

import { reduceShape, genFpDataCode, genIntDataCode } from '../../utils/dataProcess';
// import { getTensorPosFromArrayIndex } from '../atom/common_func_with_texture';
/* eslint-disable max-lines-per-function */
function getTensorPosFromArrayIndex(
    textureName: string,
    {
        numbers_shape,
        length_shape
    }
) {
    if (length_shape === 1) {
        return `
            int getTensorPosFromArrayIndex_${textureName}(int n) {
                return int(mod(float(n), float(${numbers_shape[0]})));
            }
        `;
    }

    const shapeVec = `ivec${length_shape}(${numbers_shape.join(', ')})`;
    return `
    ivec${length_shape} shapeVec_${textureName} = ${shapeVec};
    ivec${length_shape} getTensorPosFromArrayIndex_${textureName}(int n) {
        ivec${length_shape} pos;
        pos[0] = n / shapeVec_${textureName}[0];
        for (int i = 1; i < ${length_shape}; i++) {
            n = n - pos[i - 1] * shapeVec_${textureName}[i - 1];
            pos[i] = n / shapeVec_${textureName}[i];
        }
        return pos;
    }
    `;
}

function genCallRemainFunc(density_acc_shape) {
    let callRemainStr = 'ivec2 calRemain(int remain, int curAccIndex, int s) {';

    const len = density_acc_shape.length;

    if (len === 1) {
        callRemainStr += `
            int accIndex0 = density_acc_shape;

            if (remain >= accIndex0) {
                s++;
                remain -= accIndex0;
            }
            else {
                return ivec2(remain, s);
            }
            `;
    }
    else {
        for (let i = 0; i < len; i++) {
            callRemainStr += `
            int accIndex${i} = density_acc_shape[${i}];

            if (remain >= accIndex${i}) {
                s++;
                remain -= accIndex${i};
            }
            else {
                return ivec2(remain, s);
            }
            `;
        }
    }


    callRemainStr += `
    }
    `;

    return callRemainStr;
}

function mainFunc(
    { origin, image, out },
    {
        variances = [0.1, 0.1, 0.2, 0.2],
        fixed_sizes,
        fixed_ratios,
        densities,
        flatten_to_2d,
        clip,
        step_w = 0,
        step_h = 0,
        offset = 0.5,
        runtime = 0
    }
) {
    const { height_shape: img_height, width_shape: img_width } = image;
    const { height_shape: feature_height, width_shape: feature_width } = origin;
    const { total_shape, channel: outC, height_shape: outH, width_shape: outW } = out;
    const outN = total_shape / outC / outH / outW;

    const numbers_shape = reduceShape([outN, outC, outH, outW]);

    let step_width = step_w;
    let step_height = step_h;
    if (step_w === 0 || step_h === 0) {
        step_width = img_width / feature_width;
        step_height = img_height / feature_height;
    }

    const step_average = Math.round((step_width + step_height) * 0.5);
    const sqrt_fixed_ratios = fixed_ratios.map(item => Math.sqrt(item));
    const sqrt_fixed_ratios_str = sqrt_fixed_ratios.length === 1 ? 'sqrt_fixed_ratios' : 'sqrt_fixed_ratios[r]';
    const fixedRatiosLen = fixed_ratios.length;

    let outh = outH;
    let n = outN;
    let c = outC;
    if (flatten_to_2d) {
        n = feature_height;
        c = feature_width;
        outh = outH / feature_height / feature_width;
    }

    const real_numbers_shape = reduceShape([n, c, outh, outW]);

    const getTensorPosFromArrayIndexFunc = getTensorPosFromArrayIndex('out1', {
        numbers_shape: [...real_numbers_shape, 1],
        length_shape: 4
    });

    const density_acc_shape = densities.map(item => item * item * fixedRatiosLen);
    const density_acc_shape_len = density_acc_shape.length;

    const callRemainStr = genCallRemainFunc(density_acc_shape);
    const dataCode = `
        ${genFpDataCode(densities, 'densities')}
        ${genFpDataCode(fixed_sizes, 'fixed_sizes')}
        ${genFpDataCode(sqrt_fixed_ratios, 'sqrt_fixed_ratios')}
        ${genIntDataCode(density_acc_shape, 'density_acc_shape')}
    `;

    const clipCode = clip ? 'v = min(max(v, 0.), 1.);' : '';

    const curAccIndexStr = density_acc_shape_len === 1 ? 'density_acc_shape' : 'density_acc_shape[0]';


    const prefix = `
    float getFloat4TensorVal(vec4 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
        else if (index == 2) {
            return tensor[2];
        }
        else if (index == 3) {
            return tensor[3];
        }
    }
    float getFloat3TensorVal(vec3 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
        else if (index == 2) {
            return tensor[2];
        }
    }
    float getFloat2TensorVal(vec2 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
    }
    float getFloat1TensorVal(float tensor, int index) {
        return tensor;
    }
    int getInt4TensorVal(ivec4 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
        else if (index == 2) {
            return tensor[2];
        }
        else if (index == 3) {
            return tensor[3];
        }
    }
    int getInt3TensorVal(ivec3 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
        else if (index == 2) {
            return tensor[2];
        }
    }
    int getInt2TensorVal(ivec2 tensor, int index) {
        if (index == 0) {
            return tensor[0];
        }
        else if (index == 1) {
            return tensor[1];
        }
    }

    int getInt1TensorVal(int tensor, int index) {
       return tensor;
    }

    ${getTensorPosFromArrayIndexFunc}
    ${dataCode}
    ${callRemainStr}
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        int rr = int(oPos.r);
        int gg = int(oPos.g);
        int bb = int(oPos.b);
        int aa = int(oPos.a);

        // 输出坐标转换为输入坐标
        int index = rr * ${numbers_shape[0]} + gg * ${numbers_shape[1]} + bb * ${numbers_shape[2]} + aa;
        ivec4 realOutPos = getTensorPosFromArrayIndex_out1(index);
        int h = realOutPos.r;
        int w = realOutPos.g;
        int b = realOutPos.b;
        int a = realOutPos.a;
    `;
    return runtime === 1
        ? `
        ${genFpDataCode(variances, 'variances')}
        ${prefix}
        setOutput(getFloat4TensorVal(variances, aa));
        }`
        : `
            ${prefix}
            // 求idx 对应的 s, r, di, dj
            int s = 0;
            int remain = b;
            int curAccIndex = ${curAccIndexStr};

            ivec2 remainInfo = calRemain(remain, curAccIndex, s);
            remain = remainInfo[0];
            s = remainInfo[1];
            int density = int(getFloat${densities.length}TensorVal(densities, s));
            int r = int(floor(float(remain / density / density)));
            remain -= r * density * density;

            float di = floor(float(remain / density));
            float dj = float(remain - int(di) * density);

            float center_x = (float(w) + float(${offset})) * float(${step_width});
            float center_y = (float(h) + float(${offset})) * float(${step_height});
            float fixed_size = getFloat${fixed_sizes.length}TensorVal(fixed_sizes, s);
            float shift = float(${step_average}) / float(density);

            float v = 0.0;
            if (a == 0 || a == 2) {
                float box_width_ratio = fixed_size * ${sqrt_fixed_ratios_str};
                float density_center_x = center_x - float(${step_average}) / 2. + shift / 2.;
                float center_x_temp = density_center_x + dj * shift;
                if (a == 0) {
                    v = max((center_x_temp - box_width_ratio / 2.) / float(${img_width}), 0.);
                }
                else {
                    v = min((center_x_temp + box_width_ratio / 2.) / float(${img_width}), 1.);
                }
            }
            else {
                float box_height_ratio = fixed_size / ${sqrt_fixed_ratios_str};
                float density_center_y = center_y - float(${step_average}) / 2. + shift / 2.;
                float center_y_temp = density_center_y + di * shift;
                if (a == 1) {
                    v = max((center_y_temp - box_height_ratio / 2.) / float(${img_height}), 0.);
                }
                else {
                    v = min((center_y_temp + box_height_ratio / 2.) / float(${img_height}), 1.);
                }
            }

            ${clipCode}

            setOutput(float(v));
        }
        `;
}


export default {
    mainFunc,
    params: [
        'variances',
        'fixed_sizes',
        'fixed_ratios',
        'densities',
        'flatten_to_2d',
        'clip',
        'step_w',
        'step_h',
        'offset',
        'runtime',
        'numbers_shape'
    ],
    textureFuncConf: {
        image: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
};

