/**
 * @file rnn_origin
 */

function mainFunc(
    {
        weightlist_0,
        weightlist_1
    },
    {
        state_axis
    }
) {
    return `
    void main() {
        float res = 0.0;
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        ivec4 origin_pos = out_pos;
        ivec4 weight_pos = out_pos;
      
        weight_pos[1] = 0;
        weight_pos[2] = weight_pos[3];

        float b_ih = getValueFromTensorPos_weightlist_2(0, 0, 0, out_pos[3]);
        float b_hh = getValueFromTensorPos_weightlist_3(0, 0, 0, out_pos[3]);
        
        for (int j = 0; j < ${weightlist_0.width_shape}; j++) {
            float o = getValueFromTensorPos_origin(origin_pos[0], origin_pos[1], 0, j);
            float w_ih = getValueFromTensorPos_weightlist_0(0, 0, out_pos[3], j);
            res += w_ih * o;
        }
        res += b_ih;

        for (int j = 0; j < ${weightlist_1.width_shape}; j++) {
                float prestate = getValueFromTensorPos_prestate(0, 0, 0, j);
                float w_hh = getValueFromTensorPos_weightlist_1(0, ${state_axis}, out_pos[3], j);
                res += w_hh * prestate;
        }
        res += b_hh;
 
        setOutput(res);
    }
    `;
}

export default {
    mainFunc,
    params: [
        'input_axis',
        'state_axis'
    ],
    textureFuncConf: {
        origin: ['getValueFromTensorPos'],
        prestate: ['getValueFromTensorPos'],
        weightlist_0: ['getValueFromTensorPos'],
        weightlist_1: ['getValueFromTensorPos'],
        weightlist_2: ['getValueFromTensorPos'],
        weightlist_3: ['getValueFromTensorPos']
    }
};
