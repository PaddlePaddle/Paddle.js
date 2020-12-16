/**
 * @file split主函数
 */
export default `
void main(void) {
    int length = int(target_length / num);
    int layer_run_time = RUNTIME;
    ivec4 oPos = getOutputTensorPos();
    // 输出坐标转换为输入坐标
    oPos[dim] = oPos[dim] + layer_run_time * length;
    float res = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);

	ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    int index = resultCell.y + resultCell.x * width_texture_out;
	resultMatrix.numbers[index] = res;
}
`;
