const ops = {
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
            'normalizeDim'
        ]
    },
    concat_mul: {
        params: '',
        main: '',
        deps: {},
        behaviors: [
            'normalizeDim'
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
};


export {
    ops
};