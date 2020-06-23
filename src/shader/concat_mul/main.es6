/* eslint-disable */
/**
 * @file concat主函数
 * @author zhangjingyuan02
 */
export default `
// start函数
void main(void) {
    ivec4 oPos = getOutputTensorPosLIMIT_OUT();
    // 输出坐标转换为输入坐标
    float o = 0.0;
    int dim_total = inputs_dim + append_num;

    if (oPos[dim] < inputs_dim - 1) {
        o = getValueFromTensorPosLIMIT_ORIGIN_origin(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    else if (oPos[dim] < dim_total - 1) {
        o = getValueFromTensorPosLIMIT_COUNTER_counter(oPos.r, oPos.g, oPos.b, oPos.a);
    }
    else {
        o = getValueFromTensorPosLIMIT_APPENDER_appender(oPos.r, oPos.g, oPos.b, oPos.a);
    }
	setOutput(float(o));
}
`;
