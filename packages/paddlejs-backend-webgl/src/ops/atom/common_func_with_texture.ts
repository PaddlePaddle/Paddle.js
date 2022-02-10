/**
 * @file common functions with textures
 * @author yueshuangyan
 */

export function getValueFromTensorPos(
    textureName: string,
    { width_shape, height_shape, channel, width_texture, height_texture }
) {
    const chw = width_shape * height_shape * channel;
    const hw = width_shape * height_shape;
    return `
    // 根据tensor坐标获取这个tensor位置的值
    float getValueFromTensorPos_${textureName}(int n, int c, int h, int w) {
        int index = n * ${chw} + c * ${hw} + h * ${width_shape} + w;
        int pos_w = int(mod(float(index), float(${width_texture})));
        int pos_h = index / int(${width_texture});
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(pos_w)  + 0.5) / float(${width_texture}),
                (float(pos_h) + 0.5) / float(${height_texture})
            )
        );
        // 只用了r通道
        return pixels.r;
    }`;
}

export function getValueFromTensorPosPacking(
    textureName: string,
    { channel, height_shape, width_texture, height_texture, width_shape }
) {
    const chw = width_shape * height_shape * channel;
    const hw = width_shape * height_shape;
    return `
    // 根据tensor坐标获取这个tensor位置的值
    vec4 getValueFromTensorPosPacking_${textureName}(int n, int c, int h, int w) {
        int index = n * ${chw} + c * ${hw} + h * ${width_shape} + w;
        int pos_w = int(mod(float(index), float(${width_texture})));
        int pos_h = index / int(${width_texture});
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(pos_w)  + 0.5) / float(${width_texture}),
                (float(pos_h) + 0.5) / float(${height_texture})
            )
        );
        // 返回 vec4 数据
        return pixels;
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
