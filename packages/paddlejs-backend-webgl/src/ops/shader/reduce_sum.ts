
/**
 * @file reduce_sum
 */

function mainFunc(
    { origin },
    { dim }
) {
    const { total_shape, height_shape, width_shape, channel } = origin;
    const batch_shape = total_shape / (width_shape * height_shape * channel);
    const shape = [batch_shape, channel, height_shape, width_shape];
    let dimArr = [];
    if (dim instanceof Array) {
        dimArr = dim;
    }
    else {
        dimArr.push(dim);
    }

    let codeStr = '';
    const strArr = [`
        o += getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
    `];
    for (let i = 0; i < dimArr.length; i++) {
        const curDim = dimArr[i];
        const curDimShape = shape[dimArr[i]];
        const vname = `i${i}`;
        strArr.unshift(`
            for (int ${vname} = 0; ${vname} < ${curDimShape}; ${vname}++) {
                oPos[${curDim}] = ${vname};
        `);
        strArr.push(
            `
        }
        `
        );
    }

    codeStr += strArr.join('\n');

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
        'dim'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    behaviors: [

    ]
};
