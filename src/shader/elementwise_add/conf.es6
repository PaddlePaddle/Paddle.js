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
                TEXTURE_NAME: 'texture_counter'
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
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture',
            from: 'prev'
        },
        {
            tensor: 'counter',
            variable: 'texture',
            setter: 'initTexture',
            type: 'texture'
        }
    ]
};
