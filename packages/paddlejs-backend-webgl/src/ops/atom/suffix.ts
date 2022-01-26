/**
 * @file suffix code obtaining output position
 */


import { GLHelper } from '../../webgl/WebGLUtils';

interface OutParams {
    height_shape: number;
    width_shape: number;
    channel: number;
    width_texture: number;
    height_texture: number;
    limit?: string;
}

function getOutputTensorPos({ height_shape, channel }: OutParams): string {
    return `
    ivec4 getOutputTensorPos() {
        vec2 outCoord = vCoord.xy * (_2d_shape_texture_out);
        int x = int(outCoord.x / float(${channel}));
        int c = calMod(int(outCoord.x), ${channel});
        int y = calMod(int(outCoord.y), ${height_shape});
        int b = int(outCoord.y / float(${height_shape}));
        return ivec4(b, c, y, x);
    }
    `;
}

function getOutputTensorPosLimit({ height_shape, width_shape, channel }: OutParams): string {
    return `
    ivec4 getOutputTensorPos() {
        float limitCut = float(${GLHelper.getWebglTextureLimitCut()});
        // 获取原始长度
        vec2 outCoord = vCoord.xy * _2d_shape_texture_out;
        float offsetY = floor(outCoord.y / float(${height_shape}));
        int x = int(outCoord.x / float(${channel}));
        if (mod(offsetY, limitCut) > 0.0) {
            x += calMod(int(offsetY), int(limitCut)) * calCeil(${width_shape}, int(limitCut));
        }
        int y = calMod(int(outCoord.y), ${height_shape});
        int c = calMod(int(outCoord.x), ${channel});
        int b = int(outCoord.y / float(int(limitCut) * ${height_shape}));
        return ivec4(b, c, y, x);
    }
    `;
}

export default function genSuffix(params: OutParams) {
    const header = `
    vec2 _2d_shape_texture_out = vec2(float(${params.width_texture}), float(${params.height_texture}));
    `;
    const getOutputTensorPosFunc = params.limit ? getOutputTensorPosLimit(params) : getOutputTensorPos(params);

    return `
        ${header}
        ${getOutputTensorPosFunc}
    `;
}

