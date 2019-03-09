/* eslint-disable */
/**
 * @file conv2d的配置文件
 * @author yangmingming
 */
export default {
    dep: [
        {
            func: 'getArrayIndexFromTensorPos',
            conf: {
                TENSOR_TYPE: 'ivec4',
                TENSOR_NAME: 'filter'
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
                TEXTURE_NAME: 'texture_filter'
            }
        },
        {
            func: 'getValueFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_filter'
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
        'LENGTH_SHAPE_FILTER',
        'WIDTH_SHAPE_FILTER',
        'HEIGHT_SHAPE_FILTER',
        'WIDTH_TEXTURE_FILTER',
        'HEIGHT_TEXTURE_FILTER',
        'CHANNEL_FILTER',

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
        'CHANNEL_OUT',

        'STRIDE_HORIZONTAL',
        'STRIDE_VERTICAL',
        'PAD_LEFT',
        'PAD_TOP',
        'DILATION_HORIZONTAL',
        'DILATION_VERTICAL',
        'MULTI_VALUE',
        'BIAS_VALUE',
        'ACTIVE_FUNCTION'
    ],
    input: [
        {
            tensor: 'filter',
            variable: 'numbers_shape_filter',
            setter: 'uniform1iv',
            type: 'uniform'
        },
        {
            tensor: 'filter',
            variable: 'texture_filter',
            setter: 'initTexture',
            type: 'texture'
        },
        // texture类型，若添加from: 'prev', 表示读取上一个op的产出
        {
            tensor: 'origin',
            variable: 'texture_origin',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'origin',
            variable: 'numbers_shape_origin',
            setter: 'uniform1iv',
            type: 'uniform'
        },
        {
            tensor: 'origin',
            variable: 'numbers_shape_out',
            setter: 'uniform1iv',
            type: 'uniform'
        }
    ]
};
