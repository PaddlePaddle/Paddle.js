/**
 * @file feed post process
 */

function mainFunc(
    {},
    { mean = [0, 0, 0], std = [1, 1, 1] }
) {

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        int c = oPos.g;
        o = float(o / 255.0);
        if (c == 0) {
            o = (o - float(${mean[0]})) / float(${std[0]});
        } else if (c == 1) {
            o = (o - float(${mean[1]})) / float(${std[1]});
        } else if (c == 2) {
            o = (o - float(${mean[2]})) / float(${std[2]});
        }
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'mean',
        'std'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
