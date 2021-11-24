/**
 * 全部转rgb * H * W
 * @param imageData 数据
 * @param opt 参数
 * @param opt.mean 均值
 * @param opt.std 方差
 * @param opt.targetShape 输出shape
 * @param opt.colorType 颜色通道  0: rgb, 1: bgr  默认0
 * @param opt.normalizeType 0：将数据映射为0~1， 1：映射为-1~1之间, 2: 不归一化
 */
export function reshape(imageData, opt) {
    // mean和std是介于0-1之间的
    const { mean = [0, 0, 0], std = [1, 1, 1], normalizeType = 0, targetShape, colorType = 0, isNchw } = opt;
    const [, c, h, w] = targetShape;
    const data = imageData.data || imageData;

    const result = new Float32Array(new Array(c * h * w));
    let offset = 0;

    if (isNchw) {
        const C = 4;
        const H = h;
        const W = w;
        const WC = W * C;
        for (let c = 0; c < C; ++c) {
            for (let h = 0; h < H; ++h) {
                for (let w = 0; w < W; ++w) {
                    const curK = colorType === 0 ? w : (2 - w);
                    const a = h * WC + w * C + curK;

                    result[offset] = getNormalizedData(normalizeType, data[a]);
                    result[offset] -= mean[curK];
                    result[offset] /= std[curK];
                    offset++;
                }
            }
        }
        return result;
    }
    // h w c
    for (let i = 0; i < h; ++i) {
        const iw = i * w;
        for (let j = 0; j < w; ++j) {
            const iwj = iw + j;
            for (let k = 0; k < c; ++k) {
                const curK = colorType === 0 ? k : (2 - k);
                const a = iwj * 4 + curK;

                result[offset] = getNormalizedData(normalizeType, data[a]);
                result[offset] -= mean[curK];
                result[offset] /= std[curK];
                offset++;
            }
        }
    }

    return result;
}


/**
 * 全部转rgb * H * W
 * @param imageData 数据
 * @param opt 参数
 * @param opt.mean 均值
 * @param opt.std 方差
 * @param opt.targetShape 输出shape
 * @param opt.colorType 颜色通道  0: rgb, 1: bgr  默认0
 * @param opt.normalizeType 0：将数据映射为0~1， 1：映射为-1~1之间
 */
export function genFeedData(imageData, opt) {
    const data = reshape(imageData, opt);
    return [{
        data,
        shape: opt.targetShape,
        name: 'image'
    }];
}

function getNormalizedData(normalizeType, data) {
    let res = 0.0;
    switch (normalizeType) {
        case 0:
            res = data / 255;
            break;
        case 1:
            res = (data - 128) / 128;
            break;
        case 2:
            res = data;
            break;
        default:
            break;
    }

    return res;
}