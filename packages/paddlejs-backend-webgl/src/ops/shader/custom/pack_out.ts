/**
 * @file pack out
 */

function mainFunc(
    { origin },
    {}
) {
    const width_texture_origin = origin.width_texture;
    const height_texture_origin = origin.height_texture;
    return `

    vec2 getOriginCoord(float x, float y) {
        if (x > float(${width_texture_origin})) {
            int num = int(x / float(${width_texture_origin}));
            x = mod(x, float(${width_texture_origin}));
            y = y + float(num);
        }
        return vec2(x, y);
    }

    float getClipedCoordRed(vec2 xy) {
        return TEXTURE2D(
            texture_origin,
            vec2(float(xy.x / float(${width_texture_origin})), float(xy.y / float(${height_texture_origin})))
        ).r;
    }

    // start函数
    void main() {
        
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        vec4 out4;
        float x = floor(outCoord.x) * 4.0;
        float y = floor(outCoord.y) * 4.0 + 0.5;
        float x0 = x + 0.5;
        float x1 = x + 1.5;
        float x2 = x + 2.5;
        float x3 = x + 3.5;

        vec2 xy0 = getOriginCoord(x0, y);
        vec2 xy1 = getOriginCoord(x1, y);
        vec2 xy2 = getOriginCoord(x2, y);
        vec2 xy3 = getOriginCoord(x3, y);

        float r = getClipedCoordRed(xy0);
        float g = getClipedCoordRed(xy1);
        float b = getClipedCoordRed(xy2);
        float a = getClipedCoordRed(xy3);

        setPackedOutput(vec4(r, g, b, a));
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: ['getValueFromTensorPosPacking', 'getValueFromTensorPos']
    }
};
