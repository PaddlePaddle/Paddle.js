/**
 * @file conv2d deps
 */

export default [
    {
        func: 'transferFromNHWCtoNCHW'
    },
    {
        func: 'getOutputTensorPos'
    },
    {
        func: 'getValueFromTensorPos',
        conf: {
            TENSOR_NAME: 'origin'
        }
    },
    {
        func: 'getValueFromTensorPos',
        conf: {
            TENSOR_NAME: 'filter'
        }
    },
    {
        func: 'getValueFromTensorPos',
        conf: {
            TENSOR_NAME: 'bias'
        }
    }
];
