/**
 * @file feed post process
 */

function mainFunc() {

    return `

    void main(void) {
        vec2 outCoord = vCoord.xy;
        vec4 counter = TEXTURE2D(texture_origin, vCoord.xy);
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
