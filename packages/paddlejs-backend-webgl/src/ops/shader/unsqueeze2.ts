/**
 * @file unsqueeze2
 */

function mainFunc(
    {
        origin
    },
    {
        axes
    }
) {
    const {
        total_shape,
        channel,
        height_shape,
        width_shape
    } = origin;

    // 还原 origin shape，首位不为 1
    // origin_shape_start 为格式化后 [n, c, h, w] 后，原始 shape 开始的位置
    const origin_bias = total_shape / (channel * width_shape * height_shape);
    const origin_shape = [origin_bias, channel, height_shape, width_shape];
    let origin_shape_start = 0;
    for (let index = 0; index < 4; index++) {
        if (origin_shape[index] > 1) {
            break;
        }
        origin_shape_start++;
    }

    // 根据 origin_shape_start 和 插入的维度个数 axes_arr.length，计算 out_shape_start
    // origin[2, 3] & axes_arr[1] => out_shape_start === 1
    // 则对应的插入的维度，都需要 + out_shape_start，因为 output shape 格式化后，会补 1
    const axes_arr = Array.isArray(axes) ? axes : [axes];
    const out_shape_start = origin_shape_start - axes_arr.length;
    axes_arr.forEach((axis, index) => {
        axes_arr[index] = axis + out_shape_start;
    });

    // 获取 output shape 里原本对应 origin shape 的维度
    const old_axis = [0, 1, 2, 3].filter(item => axes_arr.indexOf(item) === -1);
    old_axis.reverse();

    // 生成 glsl old_axis 数组
    const old_axis_num = old_axis.length;
    function genOldAxisArr() {
        let str = `int old_axis[${old_axis_num}];`; // glsl 数组不能在声明的同时初始化
        for (let index = 0; index < old_axis_num; index++) {
            str += `old_axis[${index}] = ${old_axis[index]};`;
        }
        return str;
    }

    return `
    void main() {
        ${genOldAxisArr()}
        ivec4 oPos = getOutputTensorPos();
        ivec4 newPos = ivec4(0, 0, 0, 0);
        for (int index = 0; index < ${old_axis_num}; index++) {
            int pos = old_axis[index];
            newPos[3 - index] = oPos[pos];
        }
        float o = 0.0;
        o = getValueFromTensorPos_origin(newPos.r, newPos.g, newPos.b, newPos.a);
        setOutput(float(o));
    }
    `;
}
export default {
    mainFunc,
    params: [
        'axes'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
