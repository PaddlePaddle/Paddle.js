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
                TEXTURE_NAME: 'canvas'
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
        }
    ],
    conf: [
        'LENGTH_SHAPE_FILTER',
        'WIDTH_SHAPE_FILTER',
        'HEIGHT_SHAPE_FILTER',
        'WIDTH_TEXTURE_FILTER',
        'HEIGHT_TEXTURE_FILTER',
        'WIDTH_SHAPE_ORIGIN',
        'HEIGHT_SHAPE_ORIGIN',
        'WIDTH_SHAPE_OUT',
        'HEIGHT_SHAPE_OUT',
        'STRIDE_HORIZONTAL',
        'STRIDE_VERTICAL',
        'PAD_LEFT',
        'PAD_TOP',
        'DILATION_HORIZONTAL',
        'DILATION_VERTICAL',
        'WIDTH_RAW_CANVAS',
        'HEIGHT_RAW_CANVAS'
    ]
};
