/**
 * @file prior_box
 * @description https://github.com/PaddlePaddle/Paddle/blob/develop/paddle/fluid/operators/detection/prior_box_op.cu
 * @field GenPriorBox
 */

/* eslint-disable max-lines-per-function */

import { genFpDataCode, genFpFloatArr } from '../../utils/dataProcess';

function mainFunc(
    { origin, image, out },
    {
        variances = [0.1, 0.1, 0.2, 0.2],
        flip,
        clip,
        step_w = 0,
        step_h = 0,
        offset = 0.5,
        runtime = 0,
        min_sizes = [],
        max_sizes = [],
        aspect_ratios: input_aspect_ratios = [],
        min_max_aspect_ratios_order = false
    }
) {
    const { height_shape: img_height, width_shape: img_width } = image;
    const { height_shape: feature_height, width_shape: feature_width } = origin;
    const { channel: outC, height_shape: outH } = out;


    let step_width = step_w;
    let step_height = step_h;
    if (step_w === 0 || step_h === 0) {
        step_width = img_width / feature_width;
        step_height = img_height / feature_height;
    }

    // https://github.com/PaddlePaddle/Paddle/blob/develop/paddle/fluid/operators/detection/prior_box_op.h
    // ExpandAspectRatios
    const aspect_ratios = [1.0];
    input_aspect_ratios.forEach(item => {
        if (item !== 1.0) {
            aspect_ratios.push(Math.sqrt(item));
            flip && aspect_ratios.push(Math.sqrt(1.0 / item));
        }
    });

    const aspect_ratios_size = aspect_ratios.length;
    // calc num_priors
    // const num_priors = max_sizes && max_sizes.length > 0
    //     ? aspect_ratios_size * min_sizes.length + 1
    //     : aspect_ratios_size * min_sizes.length;


    // 这里没有使用 genFpDataCode 的原因是 aspect_ratios 长度很有可能超过 4
    // 但是 vec 最大是 vec4，所以用 float arr 更保险
    const floatArraydataCode = `
        ${genFpFloatArr(min_sizes, 'min_sizes')}
        ${genFpFloatArr(max_sizes, 'max_sizes')}
        ${genFpFloatArr(aspect_ratios, 'aspect_ratios')}
    `;

    const clipCode = clip ? 'res = min(max(res, 0.), 1.);' : '';



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

    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        int nn = int(oPos.r);
        int cc = int(oPos.g);
        int hh = int(oPos.b);
        int ww = int(oPos.a);


        ${floatArraydataCode}

    `;
    return runtime === 1
        ? `
            ${genFpDataCode(variances, 'variances')}
            ${prefix}
            float res = 0.0;
            res = getFloat4TensorVal(variances, ww);
            setOutput(float(res));
        }`
        : `
            ${prefix}
            int idx = nn * ${outC * outH} + cc * ${outH} + hh;
            int as_num = ${aspect_ratios_size};
            float offset = ${offset};
            
            int feature_width = ${feature_width};
            int num_priors = ${outH};
            float step_width = float(${step_width});
            float step_height = float(${step_height});

            float im_width = float(${img_width});
            float im_height = float(${img_height});

            bool min_max_aspect_ratios_order = ${min_max_aspect_ratios_order};

            // 求idx 对应的 h w p m
            int h = int(idx / (num_priors * feature_width));
            int w = (idx / num_priors) % feature_width;
            int p = idx % num_priors;
            int m = ${max_sizes.length > 0} ? int(p / (as_num + 1)) : int(p / as_num);
            float cx = (float(w) + offset) * step_width;
            float cy = (float(h) + offset) * step_height;
            float min_size = float(min_sizes[m]);
            float bw = 0.0;
            float bh = 0.0;

            ${max_sizes.length > 0
        ? `
            int s = p % (as_num + 1);
            if (${!min_max_aspect_ratios_order}) {
                if (s < as_num) {
                    float ar = aspect_ratios[s];
                    bw = min_size * ar / 2.0;
                    bh = min_size / ar / 2.0;
                }
                else {
                    float max_size = float(max_sizes[m]);
                    bw = sqrt(min_size * max_size) / 2.0;
                    bh = bw;
                }
            }
            else {
                if (s == 0) {
                    bh = min_size / 2.0;
                    bw = bh;
                }
                else if (s == 1) {
                    float max_size = float(max_sizes[m]);
                    bw = sqrt(min_size * max_size) / 2.0;
                    bh = bw;
                }
                else {
                    float ar = aspect_ratios[s - 1];
                    bw = min_size * sqrt(ar) / 2.0;
                    bh = min_size / sqrt(ar) / 2.0;
                }
            }`
        : `
            int s = p % as_num;
            float ar = aspect_ratios[s];
            bw = min_size * ar / 2.0;
            bh = min_size / ar / 2.0;
        `}
            float res = 0.0;
            if (ww == 0) {
                res = (cx - bw) / im_width;
            }
            else if (ww == 1) {
                res = (cy - bh) / im_height;
            }
            else if (ww == 2) {
                res = (cx + bw) / im_width;
            }
            else {
                res = (cy + bh) / im_height;
            }

            ${clipCode}

            setOutput(float(res));
        }
        `;
}


export default {
    mainFunc,
    textureFuncConf: {
        image: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
};

