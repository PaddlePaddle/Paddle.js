/**
 * @file stack dynamic inputs
 * @description stack inputs X supports no more than 15 tensors, eg. [a1, a2, a3, a4, ... , a15]
 * @detail https://github.com/PaddlePaddle/Paddle/blob/develop/paddle/fluid/operators/stack_op.h#L56
 * @detail https://www.paddlepaddle.org.cn/documentation/docs/zh/api/paddle/stack_cn.html#stack
 */

/* eslint-disable max-lines */
function mainFunc(
    { out, ...inputs },
    attrs
) {
    const origin_tensor = inputs['origin'];
    const {
        width_shape,
        height_shape,
        channel,
        total_shape,
        length_unformatted_shape
    } = origin_tensor;
    const batch = total_shape / (width_shape * height_shape * channel);

    const tensor_shape = [batch, channel, height_shape, width_shape];
    const origin_shape = tensor_shape.slice(length_unformatted_shape);

    const inputs_num = Object.keys(inputs).length;

    const axis = attrs.axis < 0 ? attrs.axis + origin_shape.length + 1 : attrs.axis;

    let pre = 1;
    let post = 1;
    for (let index = 0; index < axis; index++) {
        pre *= origin_shape[index];
    }
    for (let index = axis; index < origin_shape.length; index++) {
        post *= origin_shape[index];
    }

    const out_total_shape = out.total_shape;

    const pre_every_num = out_total_shape / pre;

    let getMultiInputsValue = '';
    getMultiInputsValue = Array.from(Array(inputs_num).keys()).reduce((acc, cur) => {
        return acc + (cur === 0
            ? `
            if (i == 0) {
                ivec4 co = getTensorPosFromArrayIndex_origin(j);
                o = getValueFromTensorPos_origin(co.r, co.g, co.b, co.a);
            }`
            : `
            else if (i == ${cur}) {
                ivec4 co = getTensorPosFromArrayIndex_origin_${cur}(j);
                o = getValueFromTensorPos_origin_${cur}(co.r, co.g, co.b, co.a);
            }`);
    }, getMultiInputsValue);


    return `
    // start函数
    void main(void) {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        int sumVal = oPos.a
            + oPos.b * ${out.width_shape}
            + oPos.g * ${out.height_shape} * ${out.width_shape}
            + oPos.r * ${out.channel} * ${out.width_shape} * ${out.height_shape};

        int index = sumVal % ${pre_every_num};

        int layer = sumVal / ${pre_every_num};

        int i = index / ${post};
        int j = index % ${post} + layer * ${post};

        
        float o = 0.0;
        ${getMultiInputsValue}
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        '@all': ['getValueFromTensorPos', 'getTensorPosFromArrayIndex']
    }
};
