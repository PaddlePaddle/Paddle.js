/**
 * @file transfer data from nhwc to nwhc layout
 */

export default `
ivec4 transferFromNHWCtoNCHW(
    int sumVal,
    const int channel,
    const int width_shape,
    const int height_shape,
    const int total_shape) {

    int n_origin = int(total_shape/(channel * width_shape * height_shape));
    int new_a = calMod(sumVal, width_shape);
    sumVal = int((sumVal - new_a) / width_shape);
    int new_b = calMod(sumVal, height_shape);
    sumVal = int((sumVal - new_b) / height_shape);
    int new_g = calMod(sumVal, channel);
    sumVal = int((sumVal - new_g) / channel);
    int new_r = calMod(sumVal, n_origin);
    return ivec4(new_r,new_g,new_b,new_a);
}
`;
