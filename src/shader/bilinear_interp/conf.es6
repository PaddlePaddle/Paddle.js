/* eslint-disable */
/**
 * @file bilinear_interp的配置文件
 * @author chenhaoze
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
