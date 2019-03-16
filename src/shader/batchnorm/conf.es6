/* eslint-disable */
/**
 * @file batchnorm的配置文件
 * @author yangmingming
 */
export default {
    dep: [
        {
            func: 'getTexturePosFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_origin',
                TENSOR_TYPE: 'vec4'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin'
            }
        },
        {
            func: 'getPixelsFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin'
            }
        },
        {
            func: 'moveTexture2PosToReal',
            conf: {
                TEXTURE_NAME: 'texture_out'
            }
        },
        {
            func: 'getArrayIndexFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_out'
            }
        },
        {
            func: 'getTensorPosFromArrayIndex',
            conf: {
                TENSOR_NAME: 'out',
                TENSOR_TYPE: 'vec4'
            }
        },
        {
            func: 'getArrayIndexFromTensorPos',
            conf: {
                TENSOR_NAME: 'origin',
                TENSOR_TYPE: 'ivec4'
            }
        },
        {
            func: 'getRangeSumFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_origin',
                TENSOR_NAME: 'origin'
            }
        },

        {
            func: 'getRangePowSumFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_origin',
                TENSOR_NAME: 'origin'
            }
        },

        {
            func: 'getTexturePosFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_scale',
                TENSOR_TYPE: 'vec4'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_scale'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_bias'
            }
        }
    ],
    conf: [
        'WIDTH_SHAPE_ORIGIN',
        'HEIGHT_SHAPE_ORIGIN',
        'LENGTH_SHAPE_ORIGIN',
        'WIDTH_TEXTURE_ORIGIN',
        'HEIGHT_TEXTURE_ORIGIN',
        'CHANNEL_ORIGIN',
        'TOTAL_SHAPE_ORIGIN',

        'WIDTH_SHAPE_OUT',
        'HEIGHT_SHAPE_OUT',
        'LENGTH_SHAPE_OUT',
        'WIDTH_TEXTURE_OUT',
        'HEIGHT_TEXTURE_OUT',
        'CHANNEL_OUT',

        'EPSILON',
        'WIDTH_TEXTURE_SCALE',
        'HEIGHT_TEXTURE_SCALE',
        'WIDTH_TEXTURE_BIAS',
        'HEIGHT_TEXTURE_BIAS',
        'MULTI_VALUE',
        'BIAS_VALUE',
        'ACTIVE_FUNCTION'
    ],
    input: [
        {
            tensor: 'scale',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'bias',
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
            tensor: 'origin',
            variable: 'numbers_shape',
            setter: 'uniform1iv',
            type: 'uniform'
        },
        {
            tensor: 'out',
            variable: 'numbers_shape',
            setter: 'uniform1iv',
            type: 'uniform'
        }
    ]
};
