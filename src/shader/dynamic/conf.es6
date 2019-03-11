/* eslint-disable */
/**
 * @file dynamic的配置文件
 * @author yangmingming
 */
export default {
    dep: [
        {
            func: 'getPixelsFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin'
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
            type: 'texture'
        }
    ]
};
