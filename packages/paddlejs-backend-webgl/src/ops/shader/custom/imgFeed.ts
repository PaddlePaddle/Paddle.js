/**
 * @file feed post process
 */

function mainFunc() {

    return `

    void main(void) {
        vec2 outCoord = vCoord.xy;
        vec4 origin = TEXTURE2D(texture_origin, vCoord.xy);
        setPackedOutput(origin);
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
