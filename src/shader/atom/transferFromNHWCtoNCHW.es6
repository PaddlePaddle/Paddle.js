/* eslint-disable */
/**
 * @file 公共方法
 * @author chenhaoze
 */
// TEXTURE_NAME, tensor name
// 获取材质中的数据
// uniform sampler2D TEXTURE_NAME;
export default `
ivec4 transferFromNHWCtoNCHW( int sumVal,  const int channel, const int width_shape, const int height_shape, const int total_shape) {

	int n_origin = int(total_shape/(channel * width_shape * height_shape));
	int new_a = sumVal % width_shape;
	sumVal = int((sumVal - new_a) / width_shape);
	int new_b = sumVal % height_shape;
	sumVal = int((sumVal - new_b) / height_shape);
	int new_g = sumVal % channel;
	sumVal = int((sumVal - new_g) / channel);
	int new_r = sumVal % n_origin;
	return ivec4(new_r,new_g,new_b,new_a);
}
`;
