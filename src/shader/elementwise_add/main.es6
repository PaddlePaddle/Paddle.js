/* eslint-disable */
/**
 * @file 加法主函数
 * @author yangmingming
 */
export default `
// start函数
void main(void) {
    // 输出数据
    ivec4 oPos = getOutputTensorPosLIMIT_OUT();
    float o = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, oPos.b, oPos.a);
	ivec4 pos_counter;
	float c = 0.0;

	if (axis == 1){
        c = getValueFromTensorPosLIMIT_COUNTER_counter(0, oPos.r, oPos.g, oPos.b);
    }
    else if (axis == 2){
        c = getValueFromTensorPosLIMIT_COUNTER_counter(0, 0, oPos.r, oPos.g);
    }
    else if (axis == 3){
        c = getValueFromTensorPosLIMIT_COUNTER_counter(0, 0, 0, oPos.r);
    }
    else {
        c = getValueFromTensorPosLIMIT_COUNTER_counter(oPos.r, oPos.g, oPos.b, oPos.a);
    }
	float res = c + o;
	setOutput(float(res));
}
`;
