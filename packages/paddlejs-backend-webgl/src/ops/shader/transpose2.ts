/**
 * @file transpose2
 */

function mainFunc(
    {},
    { axis }
) {

    let arrayPerm : number[] = axis;
    let length = arrayPerm.length;
    if (length > 4) {
        if (arrayPerm[0] === 0) {
            arrayPerm = arrayPerm.slice(1).map(perm => perm - 1);
        }
        length = arrayPerm.length;
        // throw Error(`op transpoes2 axis length exceeds maximum length 4, get ${length}`);
    }
    const temp = new Array(length).fill(0);
    for (let i = 0; i < length; i++) {
        const index = arrayPerm[i];
        temp[index] = i;
    }
    const perm_arr = [];
    for (let i = 0; i < 4; i++) {
        perm_arr[i] = temp[i] || 0;
    }
    const [
        perm_0,
        perm_1,
        perm_2,
        perm_3
    ] = perm_arr;
    const perm_size = length;

    return `
    // start函数
    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();

        // 转置 坐标变换
        float o = 0.0;
        if (${perm_size} == 1) {
            o = getValueFromTensorPos_origin(oPos[0], oPos[1], oPos[2], oPos[3]);
        }
        else if (${perm_size} == 2) {
            o = getValueFromTensorPos_origin(
                oPos[0], oPos[1],
                oPos[(2 + ${perm_0}) > 3 ? 3 : (2 + ${perm_0})],
                oPos[(2 + ${perm_1}) > 3 ? 3 : (2 + ${perm_1})]
            );
        }
        else if (${perm_size} == 3) {
            o = getValueFromTensorPos_origin(
                oPos[0],
                oPos[(1 + ${perm_0}) > 3 ? 3 : (1 + ${perm_0})],
                oPos[(1 + ${perm_1}) > 3 ? 3 : (1 + ${perm_1})],
                oPos[(1 + ${perm_2}) > 3 ? 3 : (1 + ${perm_2})]
            );
        }
        else if (${perm_size} == 4) {
            o = getValueFromTensorPos_origin(
                oPos[${perm_0}],
                oPos[${perm_1}],
                oPos[${perm_2}],
                oPos[${perm_3}]
            );
        }


        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'axis'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
