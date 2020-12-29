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

function getOutputTensorPos({ height_shape, channel }: OutParams): string {
    return `
    ivec4 getOutputTensorPos() {
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        int x = int(outCoord.x / float(${channel}));
        int c = int(mod(outCoord.x, float(${channel})));
        int y = int(mod(outCoord.y, float(${height_shape})));
        int b = int(outCoord.y / float(${height_shape}));
        return ivec4(b, c, y, x);
    }
    `;
}

function getOutputTensorPosLimit({ height_shape, width_shape, channel }: OutParams): string {
    return `
    ivec4 getOutputTensorPos() {
        // 获取原始长度
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        float offsetY = floor(outCoord.y / float(${height_shape}));
        int x = int(outCoord.x / float(${channel}));
        if (mod(offsetY, 4.0) > 0.0) {
            x += int(mod(offsetY, 4.0)) * int(ceil(float(${width_shape}) / 4.0));
        }
        int y = int(mod(outCoord.y, float(${height_shape})));
        int c = int(mod(outCoord.x, float(${channel})));
        int b = int(outCoord.y / float(4 * ${height_shape}));
        return ivec4(b, c, y, x);
    }
    `;
}

export default function genSuffix(params: OutParams, { limit = null } = {}) {
    const header = `
    vec2 _2d_shape_texture_out = vec2(float(${params.width_texture}), float(${params.height_texture}));
    `;
    const getOutputTensorPosFunc = limit ? getOutputTensorPosLimit(params) : getOutputTensorPos(params);

    return `
        ${header}
        ${getOutputTensorPosFunc}
    `;
}

