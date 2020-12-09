/**
 * @file getOutputTensorPos
 * @desc 根据tensor坐标获取这个tensor位置的值
 */

export default `
ivec4 getOutputTensorPos() {
    ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    int index = resultCell.y + resultCell.x * width_texture_out;
    int NP = channel_out * height_shape_out * width_shape_out;
    int CP = height_shape_out * width_shape_out;
    int HP = width_shape_out;
    // 材质体系转tensor体系坐标位置
    int b = int(index / NP);
    int c = int((index - b * NP) / CP);
    int h = int((index - b * NP - c * CP) / HP);
    int w = int(index - b * NP - c * CP - h * HP);
    return ivec4(b, c, h, w);
}

`;
