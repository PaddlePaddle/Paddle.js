/**
 * @file common functions with textures
 * @author yueshuangyan
 */

// 根据tensor坐标获取对应纹理位置的pixel.r，返回值为 R 通道值
export function getValueFromTensorPos(
    textureName: string,
    { width_shape, height_shape, channel, width_texture, height_texture }
) {
    const chw = width_shape * height_shape * channel;
    const hw = width_shape * height_shape;
    return `
    float getValueFromTensorPos_${textureName}(int n, int c, int h, int w) {
        int index = n * ${chw} + c * ${hw} + h * ${width_shape} + w;
        // 0.01 hack: 在 PC/WISE 机器上，出现某个值（比如 index 为 3520） float(index) 和 float(3520) 返回值不同的情况，目前 +0.01 hack
        int pos_w = int(mod(float(index) + 0.01, float(${width_texture})));
        int pos_h = index / int(${width_texture});
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(pos_w)  + 0.5) / float(${width_texture}),
                (float(pos_h) + 0.5) / float(${height_texture})
            )
        );
        return pixels.r;
    }`;
}

// 根据tensor坐标获取对应纹理位置的pixel，返回值为四通道值 RGBA
export function getValueFromTensorPosPacking(
    textureName: string,
    { channel, height_shape, width_texture, height_texture, width_shape }
) {
    const chw = width_shape * height_shape * channel;
    const hw = width_shape * height_shape;
    return `
    vec4 getValueFromTensorPosPacking_${textureName}(int n, int c, int h, int w) {
        int index = n * ${chw} + c * ${hw} + h * ${width_shape} + w;
        // 0.01 hack: 在 PC/WISE 设备上，出现某个值（比如 index 为 3520） float(index) 和 float(3520) 返回值不同的情况，目前 +0.01 hack
        int pos_w = int(mod(float(index) + 0.01, float(${width_texture})));
        int pos_h = index / int(${width_texture});
        vec4 pixels = TEXTURE2D(texture_${textureName},
            vec2(
                (float(pos_w)  + 0.5) / float(${width_texture}),
                (float(pos_h) + 0.5) / float(${height_texture})
            )
        );
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
