export default {
    mul: {
        params: '',
        main: '',
        behaviors: [
            'reshape'
        ]
    },
    concat: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'normalizeDim',
            'normalizeDim2'
        ]
    },
    concat_mul: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'normalizeDim',
            'normalizeDim2'
        ]
    },
    conv2d: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'adaptPaddings',
            'isApplySeparableConv',
            'batchComputeConv2d',
            'processBias'
        ]
    },
    elementwise_add: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'processAxis'
        ]
    },
    split: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'normalizeDim'
        ]
    }
}