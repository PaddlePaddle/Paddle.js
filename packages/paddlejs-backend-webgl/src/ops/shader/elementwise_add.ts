/**
 * @file elementwise_add
 */

function mainFunc(
    {},
    {
        axis,
        Scale_y = 1.0,
        Scale_x = 1.0,
        Scale_out = 1.0
    }
) {

    return `
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        float c = 0.0;

        if ( ${axis} == 1){
            c = getValueFromTensorPos_counter(0, oPos.r, oPos.g, oPos.b);
        }
        else if ( ${axis} == 2){
            c = getValueFromTensorPos_counter(0, 0, oPos.r, oPos.g);
        }
        else if ( ${axis} == 3){
            c = getValueFromTensorPos_counter(0, 0, 0, oPos.r);
        }
        else {
            c = getValueFromTensorPos_counter(oPos.r, oPos.g, oPos.b, oPos.a);
        }
        float res = float(${Scale_out / Scale_y}) * c + float(${Scale_out / Scale_x}) * o;
        setOutput(float(res));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'axis',
        'Scale_y',
        'Scale_x',
        'Scale_out'
    ],
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
        'processAxis'
    ],
    inputsName: [
        'X',
        'Y'
    ]
};
