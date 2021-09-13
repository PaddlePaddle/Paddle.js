/**
 * @file feed post process
 */

function mainFunc() {
    return `
    uniform vec2 u_scale;
    void main(void) {
        vec2 outCoord = vCoord.xy;
        vec2 newPos = vCoord / u_scale;
        vec2 startPos = (1.0 / u_scale - 1.0) / 2.0;
        bool exceedX = u_scale.y == 1.0 && (newPos.x < startPos.x || newPos.x > (1.0 + startPos.x));
        bool exceedY = u_scale.x == 1.0 && (newPos.y < startPos.y || newPos.y > (1.0 + startPos.y));
        if (exceedX || exceedY) {
            setPackedOutput(vec4(1.0, 1.0, 1.0, 1.0));
            return;
        }
        newPos = newPos - startPos;
        vec4 counter = TEXTURE2D(texture_origin, newPos);
        setPackedOutput(counter);
    }
    `;
}
export default {
    mainFunc,
    params: [],
    textureFuncConf: {
        origin: []
    }
};
