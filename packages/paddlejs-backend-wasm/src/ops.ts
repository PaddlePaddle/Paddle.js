export default {
    relu: {
        behaviors: ['transToPrelu']
    },
    relu6: {
        behaviors: ['transToRelu6']
    },
    leaky_relu: {
        behaviors: ['transToLeakyrelu']
    },
    transToLeakyrelu: {
        behaviors: ['transToLeakyrelu']
    },
    scale: {
        behaviors: ['transToScale']
    },
    sigmoid: {
        behaviors: ['transToSigmoid']
    },
    hard_sigmoid: {
        behaviors: ['transToHardSigmoid']
    },
    pow: {
        behaviors: ['transToPow']
    },
    sqrt: {
        behaviors: ['transToSqrt']
    },
    tanh: {
        behaviors: ['transToTanh']
    },
    concat_mul: {
        behaviors: ['normalizeDim']
    },
    concat: {
        behaviors: ['normalizeDim']
    },
    conv2d_elementwise_add: {
        behaviors: [
            'mergeAttrs',
            'checkIsMerge',
            'setActiveFunc'
        ]
    },
    conv2d_transpose: {
        behaviors: [
            'adaptPaddings',
            'isApplySeparableConv',
            'batchComputeConv2d',
            'processBias'
        ]
    },
    conv2d: {
        behaviors: [
            'adaptPaddings',
            'isApplySeparableConv',
            'batchComputeConv2d',
            'processBias'
        ]
    },
    elementwise_add: {
        behaviors: [
            'processAxis',
            'genElementwiseCounterPos'
        ]
    },
    elementwise_div: {
        behaviors: [
            'processAxis',
            'genElementwiseCounterPos'
        ]
    },
    elementwise_mul: {
        behaviors: [
            'processAxis',
            'genElementwiseCounterPos'
        ]
    },
    elementwise_sub: {
        behaviors: [
            'processAxis',
            'genElementwiseCounterPos'
        ]
    },
    pool2d_max: {
        behaviors: [
            'isMax',
            'setPacked',
            'setAdaptive',
            'isGlobalPooling'
        ]
    },
    poo2d_winograd: {
        behaviors: [
            'isMax',
            'setPacked',
            'isGlobalPooling'
        ]
    },
    pool2d: {
        behaviors: [
            'isMax',
            'setPacked',
            'setAdaptive'
        ]
    },
    reduce_mean: {
        behaviors: ['normalizeDim']
    },
    reduce_sum: {
        behaviors: ['normalizeDim']
    },
    split: {
        behaviors: ['normalizeDim']
    },
    transpose2: {
        behaviors: ['normalizeDim']
    },
    dropout: {
        behaviors: ['normalizeDim']
    }
};
