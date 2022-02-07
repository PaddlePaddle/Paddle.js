/**
 * @file suffix code obtaining output position
 */

interface OutParams {
    height_shape: number;
    width_shape: number;
    channel: number;
    width_texture: number;
    height_texture: number;
}

function getOutputTensorPos({ height_shape, width_shape, width_texture, channel }: OutParams): string {
    const chw = width_shape * height_shape * channel;
    const hw = width_shape * height_shape;
    return `
    ivec4 getOutputTensorPos() {
        vec2 outCoord = vCoord.xy * (_2d_shape_texture_out);
        int index = int(outCoord.x) + int(outCoord.y) * int(${width_texture});

        int n1 = int(index / ${chw});
        int c1 = int(calMod(index, ${chw}) / ${hw});
        int h1 = int(calMod(index, ${hw}) / ${width_shape});
        int w1 = calMod(index, ${width_shape});
        return ivec4(n1, c1, h1, w1);
    }
    `;
}

export default function genSuffix(params: OutParams) {
    const header = `
    vec2 _2d_shape_texture_out = vec2(float(${params.width_texture}), float(${params.height_texture}));
    `;
    const getOutputTensorPosFunc = getOutputTensorPos(params);

    return `
        ${header}
        ${getOutputTensorPosFunc}
    `;
}

