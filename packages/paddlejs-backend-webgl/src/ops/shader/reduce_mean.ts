
/**
 * @file reduce_mean
 */

function mainFunc(
    { origin },
    { dim }
) {
    const { total_shape, height_shape, width_shape, channel } = origin;
    const batch_shape = total_shape / (width_shape * height_shape * channel);
    const shape = [batch_shape, channel, height_shape, width_shape];
    let codeStr = '';
    for (let i = 0; i < dim.length; i++) {
        for (let j = 0; j < shape[dim[i]]; j++) {
            codeStr += `
                oPos[${dim[i]}] = ${j};
                o += getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
            `;
            if (j === shape[dim[i]]) {
                codeStr += `o / float(${j});`;
            }
        }
    }

    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        float o = 0.0;
        ${codeStr}
        setOutput(o);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'inputs_dim',
        'dim'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [

    ]
};
