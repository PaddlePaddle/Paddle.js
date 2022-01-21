/**
 * @file nearest_interp
 */

function mainFunc(
    { origin, out },
    { align_corners }
) {

    return `
    // start函数
    int getData(float n, float scale, bool align_corners) {
        float m = align_corners ? (n / scale + 0.5) : (n / scale);
        return int(floor(m));
    }

    void main(void) {
        // 输出数据
        ivec4 oPos = getOutputTensorPos();
        
        float scale_x = 0.0;
        float scale_y = 0.0;
        if (${align_corners}) {
            scale_x = float(${out.width_shape} -1) / float(${origin.width_shape} - 1);
            scale_y = float(${out.height_shape} - 1) / float(${origin.height_shape} - 1);
        }
        else {
            scale_x = float(${out.width_shape}) / float(${origin.width_shape});
            scale_y = float(${out.height_shape}) / float(${origin.height_shape});
        }
    
        int vx = getData(float(oPos.a), scale_x, ${align_corners});
        int vy = getData(float(oPos.b), scale_y, ${align_corners});
        
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, vy, vx);
        setOutput(float(o));
}
    `;
}

export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    },
    commonFuncConf: ['transferFromNHWCtoNCHW']
};
