/* eslint-disable */
/**
 * @file concat的配置文件
 * @author zhangjingyuan02
 */
export default {
    dep: [
        {
            func: 'getValueFromTensorPos',
            conf: {
                TENSOR_NAME: 'origin'
            }
        },
        {
            func: 'getValueFromTensorPos',
            conf: {
                TENSOR_NAME: 'counter'
            }
        },
        {
            func: 'getValueFromTensorPos',
            conf: {
                TENSOR_NAME: 'appender'
            }
        },
        {
            func: 'transferFromNHWCtoNCHW'
        }
    ],
    conf: [
        'LENGTH_SHAPE_COUNTER',
        'WIDTH_SHAPE_COUNTER',
        'HEIGHT_SHAPE_COUNTER',
        'WIDTH_TEXTURE_COUNTER',
        'HEIGHT_TEXTURE_COUNTER',
        'CHANNEL_COUNTER',

        'LENGTH_SHAPE_APPENDER',
        'WIDTH_SHAPE_APPENDER',
        'HEIGHT_SHAPE_APPENDER',
        'WIDTH_TEXTURE_APPENDER',
        'HEIGHT_TEXTURE_APPENDER',
        'CHANNEL_APPENDER',

        'WIDTH_SHAPE_ORIGIN',
        'HEIGHT_SHAPE_ORIGIN',
        'LENGTH_SHAPE_ORIGIN',
        'WIDTH_TEXTURE_ORIGIN',
        'HEIGHT_TEXTURE_ORIGIN',
        'CHANNEL_ORIGIN',

        'WIDTH_SHAPE_OUT',
        'HEIGHT_SHAPE_OUT',
        'WIDTH_TEXTURE_OUT',
        'HEIGHT_TEXTURE_OUT',
        'CHANNEL_OUT',
        'OFFSET_Y_OUT'
    ],
    input: [
        {
            tensor: 'origin',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'counter',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'appender',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        }
    ]
};
