/**
 * @file rnn_matmul
 */

function mainFunc(
    {
        weightlist_0
    },
    {
        input_axis,
        state_axis,
        batch,
        reverse = false
    }
) {
    const transform_input_axis = reverse ? batch - input_axis - 1 : input_axis;

    return `
    void main() {
         float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        
        if (${input_axis === 0}) {
            res = getValueFromTensorPos_origin(out_pos[0], ${transform_input_axis}, out_pos[2], out_pos[3]);
            setOutput(res);
            return;
        }
        
        ivec4 origin_pos = out_pos;
        ivec4 weight_pos = out_pos;

        weight_pos[1] = 0;
        weight_pos[2] = weight_pos[3];

        float o = 0.0;
        float w_hh = 0.0;
        float prestate_h = 0.0;
        res = getValueFromTensorPos_origin(out_pos[0], ${transform_input_axis}, out_pos[2], out_pos[3]);
        for (int j = 0; j < ${weightlist_0.width_shape}; j++) {
            prestate_h = getValueFromTensorPos_prestate(origin_pos[0], origin_pos[1], origin_pos[2], j);
            w_hh = getValueFromTensorPos_weightlist_0(out_pos[0], ${state_axis}, out_pos[3], j);
            o += w_hh * prestate_h;
        }
        res += o;

        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'input_axis',
        'state_axis',
        'reverse',
        'batch'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        prestate: ['getValueFromTensorPos'],
        weightlist_0: ['getValueFromTensorPos']
    }
};
