/* eslint-disable */
/**
 * @file mul的配置文件
 * @author yangmingming zhangmiao06
 */
export default {
    dep: [
        {
            func: 'getArrayIndexFromTensorPos',
            conf: {
                TENSOR_TYPE: 'ivec4',
                TENSOR_NAME: 'counter'
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
            func: 'getTexturePosFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_counter'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_counter'
            }
        },

        {
            func: 'getArrayIndexFromTensorPos',
            conf: {
                TENSOR_TYPE: 'ivec4',
                TENSOR_NAME: 'origin'
            }
        },
        {
            func: 'getTexturePosFromArrayIndex',
            conf: {
                TEXTURE_NAME: 'texture_origin'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin'
            }
        }
    ],
    conf: [
        'LENGTH_SHAPE_COUNTER',
        'WIDTH_SHAPE_COUNTER',
        'HEIGHT_SHAPE_COUNTER',
        'WIDTH_TEXTURE_COUNTER',
        'HEIGHT_TEXTURE_COUNTER',
        'CHANNEL_COUNTER',

        'WIDTH_SHAPE_ORIGIN',
        'HEIGHT_SHAPE_ORIGIN',
        'LENGTH_SHAPE_ORIGIN',
        'WIDTH_TEXTURE_ORIGIN',
        'HEIGHT_TEXTURE_ORIGIN',
        'CHANNEL_ORIGIN',

        'WIDTH_SHAPE_OUT',
        'HEIGHT_SHAPE_OUT',
        'LENGTH_SHAPE_OUT',
        'WIDTH_TEXTURE_OUT',
        'HEIGHT_TEXTURE_OUT',
        'CHANNEL_OUT'
    ],
    input: [
        {
            tensor: 'counter',
            variable: 'numbers_shape',
            setter: 'uniform1iv',
            type: 'uniform'
        },
        {
            tensor: 'counter',
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
