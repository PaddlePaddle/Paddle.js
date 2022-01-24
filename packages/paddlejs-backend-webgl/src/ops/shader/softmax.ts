/**
 * @file softmax
 */

function mainFunc(
    { origin },
    { axis }
) {
    let axisVal = axis;
    if (!axis || axis < 0) {
        axisVal = (axis || -1) + 4;
    }
    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        const int n = int(${origin.total_shape}/${origin.channel}/${origin.height_shape}/${origin.width_shape});
        float o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], oPos[3]);
        // 输出坐标转换为输入坐标
        float total = 0.0;
        float res = 0.0;
        if (${axisVal} == 0) {
            for (int i = 0; i < n; i++){
            float temp = getValueFromTensorPos_origin(i, oPos[1], oPos[2], oPos[3]);
            total += exp(temp);
            }
            res = exp(o) / total;
        }
        else if (${axisVal} == 1) {
            for (int i = 0; i < ${origin.channel}; i++){
            float temp = getValueFromTensorPos_origin(oPos[0], i, oPos[2], oPos[3]);
            total += exp(temp);
            }
            res = exp(o) / total;
        }
        else {
            for (int i = 0; i < ${origin.width_shape}; i++){
            float temp = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], i);
            total += exp(temp);
            }
            res = exp(o) / total;
        }
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
