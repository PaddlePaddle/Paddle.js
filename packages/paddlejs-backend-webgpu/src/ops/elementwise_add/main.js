/**
 * @file main
 */

export default `
void main(void) {
    ivec4 oPos = getOutputTensorPos();
    float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
	float c = 0.0;

	if (axis == 1) {
        c = getValueFromTensorPos_counter(0, oPos.r, oPos.g, oPos.b);
    }
    else if (axis == 2){
        c = getValueFromTensorPos_counter(0, 0, oPos.r, oPos.g);
    }
    else if (axis == 3){
        c = getValueFromTensorPos_counter(0, 0, 0, oPos.r);
    }
    else {
        c = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    float res = c + o;

    ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    int index = resultCell.y + resultCell.x * width_texture_origin;
	resultMatrix.numbers[index] = (res);
}
`;
