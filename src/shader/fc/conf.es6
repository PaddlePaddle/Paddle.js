/* eslint-disable */
/**
 * @file fc的配置文件
 * @author zhangjingyuan02
 */
export default {
    dep: [
        {
            func: 'getValueFromTensorPos',
            conf: {
                TENSOR_NAME: 'weight'
            }
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
                TENSOR_NAME: 'bias'
            }
        }
    ],
    conf: [],
    input: [
        {
            tensor: 'weight',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'origin',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'bias',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        }
    ]
};
