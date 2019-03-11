/* eslint-disable */
/**
 * @file pool2d的配置文件
 * @author yangmingming zhangmiao06
 */
export default {
    dep: [
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
        'KSIZE_X',
        'KSIZE_Y',
        'TYPE_POOL',

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

        'STRIDES_X',
        'STRIDES_Y',
        'PADDING_X',
        'PADDING_Y'
    ],
    input: [
        // texture类型，若添加from: 'prev', 表示读取上一个op的产出
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
