/* eslint-disable */
/**
 * @file 加法的配置文件
 * @author yangmingming
 */
export default {
    dep: [
        {
            func: 'getPixelsFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin'
            }
        },
        {
            func: 'getPixelsFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_add'
            }
        }
    ],
    conf: [
        'MULTI_VALUE',
        'BIAS_VALUE',
        'ACTIVE_FUNCTION'
    ],
    input: [
        {
            tensor: 'origin',
            variable: 'texture_origin',
            setter: 'initTexture',
            type: 'texture',
            from: 'prev'
        },
        {
            tensor: 'add',
            variable: 'texture_add',
            setter: 'initTexture',
            type: 'texture'
        }
    ]
};
