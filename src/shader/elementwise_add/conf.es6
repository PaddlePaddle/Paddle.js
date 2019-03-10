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
        },
        {
            func: 'getPixelsFromTexturePos',
            conf: {
                TEXTURE_NAME: 'texture_origin2'
            }
        }
    ],
    conf: [
    ],
    input: [
        // texture类型，若添加from: 'prev', 表示读取上一个op的产出
        {
            tensor: 'origin',
            variable: 'texture_origin',
            setter: 'initTexture',
            type: 'texture'
        },
        {
            tensor: 'origin2',
            variable: 'texture_origin2',
            setter: 'initTexture',
            type: 'texture'
        }
    ]
};
