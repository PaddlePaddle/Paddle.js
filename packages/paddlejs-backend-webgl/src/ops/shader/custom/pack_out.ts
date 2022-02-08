/**
 * @file pack out
 */

function mainFunc(
    { out },
    {}
) {
    return `

    // start函数
    void main() {
        ivec4 oPos = getOutputTensorPos();
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        int index = int(outCoord.x) + int(outCoord.y) * int(${out.width_texture});

        int first = index * 4;
        int sec = index * 4 + 1;
        int third = index * 4 + 2;
        int fourth = index * 4 + 3;

        ivec4 rPos = getTensorPosFromArrayIndex_origin(first);
        ivec4 gPos = getTensorPosFromArrayIndex_origin(sec);
        ivec4 bPos = getTensorPosFromArrayIndex_origin(third);
        ivec4 aPos = getTensorPosFromArrayIndex_origin(fourth);

        float r = getValueFromTensorPos_origin(rPos.r, rPos.g, rPos.b, rPos.a);
        float g = getValueFromTensorPos_origin(gPos.r, gPos.g, gPos.b, gPos.a);
        float b = getValueFromTensorPos_origin(bPos.r, bPos.g, bPos.b, bPos.a);
        float a = getValueFromTensorPos_origin(aPos.r, aPos.g, aPos.b, aPos.a);

        setPackedOutput(vec4(r, g, b, a));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPos', 'getTensorPosFromArrayIndex']
    }
};
