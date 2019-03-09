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
        // texture类型，若添加from: 'prev', 表示读取上一个op的产出
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
