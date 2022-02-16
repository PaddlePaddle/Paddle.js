/**
 * @file reshape2
 */

function mainFunc(
    { out },
    {}
) {
    return `
    // start函数
    void main(void) {
        vec2 outCoord = vCoord.xy * (_2d_shape_texture_out);
        int index = int(outCoord.x) + int(outCoord.y) * int(${out.width_texture});
        ivec4 originPos = getTensorPosFromArrayIndex_origin(index);
        float res = getValueFromTensorPos_origin(originPos[0], originPos[1], originPos[2], originPos[3]);
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getTensorPosFromArrayIndex', 'getValueFromTensorPos']
    }
};
