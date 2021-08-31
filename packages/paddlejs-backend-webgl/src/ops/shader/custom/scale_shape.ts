/**
 * @file fetch
 */

function mainFunc(
    { out },
    {}
) {
    const HEIGHT = out.height_shape;
    const CHANNEL = out.channel;
    return `

    ivec4 getScaledOutputTensorPos() {
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        // 材质体系转tensor体系坐标位置
        int x = int(outCoord.x / float(${CHANNEL}));
        int c = int(mod(outCoord.x, float(${CHANNEL})));
        int y = int(mod(outCoord.y, float(${HEIGHT})));
        int b = int(outCoord.y / float(${HEIGHT}));
        return ivec4(b, c, y, x);
    }

    void main() {
        ivec4 oPos = getOutputTensorPos();
        // 输出坐标转换为输入坐标
        // vec4 oPos = oPos2 / 4.0;
        float o = getValueFromTensorPos_origin(oPos.r, oPos.g, oPos.b, oPos.a);
        setOutput(float(1.0));
    }
    `;
}
export default {
    mainFunc,
    params: [],
    textureFuncConf: {
        origin: ['getValueFromTensorPos']
    }
};
