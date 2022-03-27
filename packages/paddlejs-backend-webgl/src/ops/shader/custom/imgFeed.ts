/**
 * @file feed post process
 */

function mainFunc() {
    return `
    uniform vec2 u_scale;
    uniform int u_keep_ratio;

    void main(void) {
        vec2 outCoord = vCoord.xy;
        // 支持模型不按比例拉伸
        if (u_keep_ratio == 0) {
            vec4 origin = TEXTURE2D(texture_origin, outCoord);
            setPackedOutput(origin);
            return;
        }
        float startX = (1.0 - u_scale.x) / 2.0;
        float endX = startX + u_scale.x;
        float startY = (1.0 - u_scale.y) / 2.0;
        float endY = startY + u_scale.y;

        if (outCoord.x >= startX && outCoord.x <= endX && outCoord.y >= startY && outCoord.y <= endY) {
            vec2 newPos = (outCoord - vec2(startX, startY)) / u_scale;
            vec4 origin = TEXTURE2D(texture_origin, newPos);
            setPackedOutput(origin);
        }
        else {
            setPackedOutput(vec4(1.0));
        }
    }
    `;
}
export default {
    mainFunc,
    textureFuncConf: {
        origin: []
    }
};
