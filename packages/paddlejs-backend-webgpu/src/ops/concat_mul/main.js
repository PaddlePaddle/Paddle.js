/**
 * @file concat_mul 主函数
 */

export default `
// start函数
void main(void) {
    ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
    float res = 0.0;
    int dim_total = inputs_dim + append_num;

    if (oPos[dim] <= inputs_dim - 1) {
        
        res = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    else if (oPos[dim] <= dim_total - 1) {
        oPos[dim] = oPos[dim] - inputs_dim;
        res = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    else {
        oPos[dim] = oPos[dim] - dim_total;
        res = getValueFromTensorPos_appender(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    
	ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    int index = resultCell.y + resultCell.x * width_texture_out;
	resultMatrix.numbers[index] = res;
}
`;
