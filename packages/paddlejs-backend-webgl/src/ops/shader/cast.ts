/**
 * @file cast 该OP将 x 的数据类型转换为 dtype 并输出
 */

/**
 * data_type 值映射关系
 * BOOL = 0;
 * INT16 = 1;
 * INT32 = 2;
 * INT64 = 3;
 * FP16 = 4;
 * FP32 = 5;
 * FP64 = 6;
 */

function mainFunc(
    {},
    { out_dtype }
) {

    let middleStr = '';
    switch (out_dtype) {
        case 0:
            middleStr = `
            float res_bool = 0.0;
            if (o != 0.0) {
                res_bool = 1.0;
            }
            setOutput(res_bool);`;
            break;

        case 1:
        case 2:
        case 3:
            middleStr = `
            int res_int = int(o);
            setOutput(float(res_int));`;
            break;

        default:
            middleStr = `       
            float res_float = o;
            setOutput(res_float);`;
    }
    return `
    void main() {
       // 输出数据
        ivec4 oPos = getOutputTensorPos();
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        ${middleStr}
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
