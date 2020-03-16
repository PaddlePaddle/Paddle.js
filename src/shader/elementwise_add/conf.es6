/* eslint-disable */
/**
 * @file 加法的配置文件
 * @author yangmingming
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
			func: 'transferFromNHWCtoNCHW',
			conf:{

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
        'OFFSET_Y_OUT',

        'AXIS'
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
            variable: 'data',
            setter: 'uniform1fv',
            type: 'uniform'
        }
    ]
};
