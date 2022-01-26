/**
 * @file common functions with textures
 * @author yueshuangyan
 */

import { GLHelper } from '../../webgl/WebGLUtils';

function getValueFromTensorPosNoLimit(textureName: string, { channel, height_shape, width_texture, height_texture }) {
    return `
    // 根据tensor坐标获取这个tensor位置的值
    float getValueFromTensorPos_${textureName}(int r, int g, int b, int a) {
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(a * ${channel} + g) + 0.5) / float(${width_texture}),
                (float(r * ${height_shape} + b) + 0.5) / float(${height_texture})
            )
        );
        // 只用了r通道
        return pixels.r;
    }`;
}

function getValueFromTensorPosPackingNoLimit(
    textureName: string,
    { channel, height_shape, width_texture, height_texture }
) {
    return `
    // 根据tensor坐标获取这个tensor位置的值
    vec4 getValueFromTensorPosPacking_${textureName}(int r, int g, int b, int a) {
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(a * ${channel} + g) + 0.5) / float(${width_texture}),
                (float(r * ${height_shape} + b) + 0.5) / float(${height_texture})
            )
        );
        return pixels;
    }`;
}

function genOffsetYIfConditions(cut, height) {
    const curIndexArr = Array.from({ length: cut }, (_, i) => i).reverse();

    return curIndexArr.reduce((acc, cur, idx) => {
        const curIf = cur > 0
            ? idx === 0
                ? `
                if (float(a) / float(pieceW) >= float(${cur})) {
                    offsetY = int(${cur}) * ${height};
                }
                `
                : `
                else if (float(a) / float(pieceW) >= float(${cur})) {
                    offsetY = int(${cur}) * ${height};
                }
                `
            : '';
        return acc + curIf;
    }, '');
}

function getValueFromTensorPosLimit(
    textureName: string,
    { width_shape, height_shape, channel, width_texture, height_texture }
) {
    const limitCut = GLHelper.getWebglTextureLimitCut();
    return `
    // 超限布局根据tensor坐标获取这个tensor位置的值
    float getValueFromTensorPos_${textureName}(int r, int g, int b, int a) {
        int limitCut = ${limitCut};
        int pieceW = calCeil(${width_shape}, ${limitCut});
        int x = calMod(a, pieceW);
        int offsetY = 0;

        ${genOffsetYIfConditions(limitCut, height_shape)}

        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(x * ${channel} + g) + 0.5) / float(${width_texture}),
                (float(r * limitCut * ${height_shape} + b + offsetY) + 0.5) / float(${height_texture})
            )
        );
        return pixels.r;
    }`;
}

function getValueFromTensorPosPackingLimit(
    textureName: string,
    { width_shape, height_shape, channel, width_texture, height_texture }
) {
    return `
    // 超限布局根据tensor坐标获取这个tensor位置的值
    vec4 getValueFromTensorPosPacking_${textureName}(int r, int g, int b, int a) {
        float pieceW = ceil(float(${width_shape}) / 4.0);
        int x = calMod(a, int(pieceW));
        int offsetY = 0;

        if ((float(a) / pieceW) >= 3.0) {
            offsetY = 3 * ${height_shape};
        }
        else if (float(a) / pieceW >= 2.0) {
            offsetY = 2 * ${height_shape};
        }
        else if (float(a) >= pieceW) {
            offsetY = ${height_shape};
        }
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(x * ${channel} + g) + 0.5) / float(${width_texture}),
                (float(r * 4 * ${height_shape} + b + offsetY) + 0.5) / float(${height_texture})
            )
        );
        return pixels;
    }`;
}

export function getValueFromTensorPos(textureName: string, textureParams) {
    return textureParams.limit
        ? getValueFromTensorPosLimit(textureName, textureParams)
        : getValueFromTensorPosNoLimit(textureName, textureParams);
}

export function getValueFromTensorPosPacking(textureName: string, textureParams) {
    return textureParams.limit
        ? getValueFromTensorPosPackingLimit(textureName, textureParams)
        : getValueFromTensorPosPackingNoLimit(textureName, textureParams);

}

export function getValueFromTensorPosPacked(
    textureName: string,
    { offset_y, height_shape, width_texture, height_texture }
) {
    return `
    // 超限布局根据tensor坐标获取这个tensor位置的值
    float getValueFromTensorPosPacked_${textureName}(int r, int g, int b, int a) {
        int y = b / 2;
        int yOffset = calMod(b, 2);
        int x = a / 2;
        int xOffset = calMod(a, 2);
        int height = ${height_shape} + ${offset_y};
        vec4 pixels = TEXTURE2D(
            texture_${textureName},
            vec2((float(x) + 0.5) / float(${width_texture}),
            (float(g * height / 2 + y) + 0.5) / float(${height_texture}))
        );
        int index = 0;
        if (xOffset == 0 && yOffset == 0) {
            return pixels[0];
        }
        else if (xOffset == 1 && yOffset == 0) {
            return pixels[1];
        }
        else if (xOffset == 0 && yOffset == 1) {
            return pixels[2];
        }
        return pixels[3];
    }`;
}

export function getTensorPosFromArrayIndex(
    textureName: string,
    {
        numbers_shape,
        length_shape
    }
) {
    if (length_shape === 1) {
        return `
            int getTensorPosFromArrayIndex_${textureName}(int n) {
                return calMod(n, ${numbers_shape[0]});
            }
        `;
    }

    const shapeVec = `ivec${length_shape}(${numbers_shape.join(', ')})`;

    let posStr = `pos[0] = n / ${numbers_shape[0]};`;
    for (let i = 1; i < length_shape; i++) {
        posStr += `
            n = calMod(n, ${numbers_shape[i - 1]});
            pos[${i}] = calDivision(n, ${numbers_shape[i]});
        `;
    }
    return `
    ivec${length_shape} shapeVec_${textureName} = ${shapeVec};
    ivec${length_shape} getTensorPosFromArrayIndex_${textureName}(int n) {
        ivec${length_shape} pos;
        ${posStr}
        return pos;
    }
    `;
}
export function getPixelsFromTexturePos(textureName: string) {
    return `
    #define getPixelsFromTexturePos_${textureName}(pos) TEXTURE2D(texture_${textureName}, pos)
    `;
}

export function moveTexture2PosToReal(textureName: string, { width_texture, height_texture }) {
    return `
    vec2 moveTexture2PosToReal_${textureName}(vec2 v) {
        vec2 v2;
        v2.x = v.x * float(${width_texture});
        v2.y = v.y * float(${height_texture});
        return v2;
    }
    `;
}

export function getSamplerCode(textureName: string) {
    return `uniform sampler2D texture_${textureName};`;
}
