import * as util from './utils';

function getEffectiveFilterSize(filterSize: number, dilation: number) {
    if (dilation <= 1) {
        return filterSize;
    }
    return filterSize + (filterSize - 1) * (dilation - 1);
}

export function computeDefaultPad(
    inputShape: [number, number] | [number, number, number, number],
    fieldSize: number, stride: number, dilation = 1): number {
    const effectiveFieldSize = getEffectiveFilterSize(fieldSize, dilation);
    return Math.floor(
        (inputShape[0] * (stride - 1) - stride + effectiveFieldSize) / 2);
}

function computeConv2DInfo(
    originShape: [number, number, number, number],
    filterShape: [number, number, number, number],
    outShape: [number, number, number, number],
    strides: [number, number], dilations: [number, number],
    paddings: [number, number]) {
    let [batchSize, inHeight, inWidth, inChannels] = [-1, -1, -1, -1];

    [batchSize, inChannels, inHeight, inWidth] = originShape;

    const [, , filterHeight, filterWidth] = filterShape;
    const [strideWidth, strideHeight] = strides;
    const [dilationWidth, dilationHeight] = dilations;

    const effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    const effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);

    const padInfo = { top: paddings[0], left: paddings[1] };
    const [, outChannels, outHeight, outWidth] = outShape;

    return {
        batchSize,
        inHeight,
        inWidth,
        inChannels,
        outHeight,
        outWidth,
        outChannels,
        padInfo,
        strideHeight,
        strideWidth,
        filterHeight,
        filterWidth,
        effectiveFilterHeight,
        effectiveFilterWidth,
        dilationHeight,
        dilationWidth,
        originShape: convertShapeFromNchw2Nhwc(originShape),
        outShape: convertShapeFromNchw2Nhwc(outShape),
        filterShape: convertShapeFromNchw2Nhwc(filterShape)
    };
}

function padToFourDimShape(shape) {
    let fourDimShape = [] as number[];
    if (shape.length === 4) {
        fourDimShape = shape;
    }
    else if (shape.length < 4) {
        for (let i = 0; i < 4 - shape.length; i++) {
            fourDimShape.push(1);
        }
        fourDimShape = fourDimShape.concat(shape);
    }
    return fourDimShape;
}

function convertShapeFromNchw2Nhwc(shape: [number, number, number, number]): [number, number, number, number] {
    const [n, c, h, w] = shape;
    return [n, h, w, c];
}

/* eslint-disable max-statements, max-depth */
function conv2d({ tensorMap, strides, paddings, dilations }) {
    const { origin, filter, out } = tensorMap;
    const [originShape, filterShape, outShape] = [origin.shape, filter.shape, out.shape];
    const convInfo = computeConv2DInfo(originShape, filterShape, outShape, strides, paddings, dilations);
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const padLeft = convInfo.padInfo.left;
    const padTop = convInfo.padInfo.top;

    const y = new util.TensorBuffer(convInfo.outShape);

    const xStrides = util.computeStrides(origin.shape);
    const filterStrides = util.computeStrides(filter.shape);

    const xBatchStride = xStrides[0];
    const xRowStride = xStrides[2];
    const xColStride = 1;
    const xChannelStride = xStrides[1];
    const yBatchStride = y.strides[0];
    const yRowStride = y.strides[2];
    const yColStride = 1;
    const yChannelStride = y.strides[1];

    const xVals = origin.data;
    const wVals = filter.data;
    const yVals = y.values;

    for (let b = 0; b < convInfo.batchSize; ++b) {
        const xOffset1 = b * xBatchStride;
        const yOffset1 = b * yBatchStride;
        for (let yR = 0; yR < convInfo.outHeight; ++yR) {
            const yOffset2 = yOffset1 + yR * yRowStride;
            const xRCorner = yR * convInfo.strideHeight - padTop;
            for (let wR = 0; wR < filterHeight; ++wR) {
                const xR = xRCorner + wR * dilationHeight;
                if (xR < 0 || xR >= convInfo.inHeight) {
                    continue;
                }
                const wOffset1 = wR * filterStrides[0];
                const xOffset2 = xOffset1 + xR * xRowStride;
                for (let yC = 0; yC < convInfo.outWidth; ++yC) {
                    const yOffset3 = yOffset2 + yC * yColStride;
                    const xCCorner = yC * convInfo.strideWidth - padLeft;
                    for (let wC = 0; wC < filterWidth; ++wC) {
                        const xC = xCCorner + wC * dilationWidth;
                        if (xC < 0 || xC >= convInfo.inWidth) {
                            continue;
                        }
                        const wOffset2 = wOffset1 + wC * filterStrides[1];
                        const xOffset3 = xOffset2 + xC * xColStride;
                        let wOffset3 = wOffset2;
                        for (let d1 = 0; d1 < convInfo.inChannels; ++d1) {
                            const xVal = xVals[xOffset3 + d1 * xChannelStride];
                            for (let d2 = 0; d2 < convInfo.outChannels; ++d2) {
                                yVals[yOffset3 + d2 * yChannelStride]
                                    += xVal * wVals[wOffset3 + d2] || 0.0;
                            }
                            wOffset3 += convInfo.outChannels;
                        }
                    }
                }
            }
        }
    }

    return yVals;
}
/* eslint-enable max-statements, max-depth */

function mainFunc(data) {
    const { attrs, tensorData } = data;

    // 暂时input都从opData.inputTensors中获取, 后续移到program 数据处理中
    const tensorMap = {
        filter: {} as any,
        origin: {} as any,
        bias: {} as any,
        out: {} as any
    };

    for (const tensor of tensorData) {
        const { tensorName, shape, data } = tensor;
        if (!tensorName || !tensorMap[tensorName]) {
            continue;
        }
        tensorMap[tensorName] = { shape: padToFourDimShape(shape), data };
    }

    const {
        strides = [],
        paddings = [],
        dilations = []
    } = attrs;

    const result = conv2d({ tensorMap, strides, paddings, dilations });
    // main
    return result;
}

export default {
    params: [],
    mainFunc,
    behaviors: [
        'adaptPaddings',
        'isApplySeparableConv',
        'batchComputeConv2d'
    ]
};
