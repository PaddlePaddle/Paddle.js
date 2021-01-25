import { Tensor, Attrs, TensorMap } from './Tensor';
import { JSON } from '../helper/json/index';
import { computeConv2DInfo, TensorBuffer, computeStrides } from './conv2d_utils';

const tensorMap = new TensorMap();

function conv2d(tensorMap: TensorMap, attrs: Attrs): f32[] {
    if (!tensorMap.origin || !tensorMap.filter || !tensorMap.out) {
        return [];
    }
    const origin = tensorMap.origin as Tensor;
    const filter = tensorMap.filter as Tensor;
    const out = tensorMap.out as Tensor;

    const originShape: i32[] = (origin as Tensor).shape;
    const filterShape: i32[] = (filter as Tensor).shape;
    const outShape: i32[] = (out as Tensor).shape;

    const strides = attrs.strides;
    const paddings = attrs.paddings;
    const dilations = attrs.dilations;

    const convInfo = computeConv2DInfo(originShape, filterShape, outShape, strides, paddings, dilations);

    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const padLeft = convInfo.padInfo.left;
    const padTop = convInfo.padInfo.top;

    const y = new TensorBuffer(convInfo.outShape);

    const xStrides = computeStrides(origin.shape);
    const filterStrides = computeStrides(filter.shape);


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
    const wValLen = wVals.length;
    const yVals = y.values;

    // console.log(convInfo.strideHeight.toString())
    // console.log(convInfo.strideWidth.toString())
    // console.log(convInfo.inChannels.toString())
    // console.log(convInfo.outChannels.toString())

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
                                    += (wOffset3 + d2) < wValLen ? xVal * wVals[wOffset3 + d2] : 0.0;
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

function mainFunc(data: JSON.Obj, tensorDataMap: Map<string, f32[]>): f32[] {
    const tensorDataList = ((data as JSON.Obj).get('tensorData') as JSON.Arr)._arr;
    const attrs = new Attrs((data as JSON.Obj).get('attrs') as JSON.Obj);

    tensorDataList.forEach((tensor, index) => {
        if (tensor instanceof JSON.Obj) {
            const tensorObj = tensor as JSON.Obj;

            const opTensor = new Tensor(tensorObj);
            const tensorName = opTensor.tensorName;
            const name = opTensor.name;
            const tensorData = opTensor.data;


            if (tensorName == 'filter') {
                tensorMap.filter = opTensor;
            }
            else if (tensorName == 'origin') {
                tensorMap.origin = opTensor;
            }
            else if (tensorName == 'bias') {
                tensorMap.bias = opTensor;
            }
            else if (tensorName == 'out') {
                tensorMap.out = opTensor;
            }
        }
    });

    const result = conv2d(tensorMap, attrs);
    tensorDataMap.set(tensorMap.out.name, result);


    // 暂时input都从opData.inputTensors中获取, 后续移到program 数据处理中

    // const {
    //     strides = [],
    //     paddings = [],
    //     dilations = []
    // } = attrs;

    // const result = conv2d({ tensorMap, strides, paddings, dilations });
    // main
    return result;
}

export {
    // params: [],
    mainFunc,
    // behaviors: [
    //     'adaptPaddings',
    //     'isApplySeparableConv',
    //     'batchComputeConv2d'
    // ]
};
