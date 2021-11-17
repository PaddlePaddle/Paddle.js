/**
 * @file get the position of output tensor
 * @author yueshuangyan
 */

import { moveTexture2PosToReal } from './common_func_with_texture';

export default function ({ channel, height_shape, width_texture, height_texture }) {
    return `
        ${moveTexture2PosToReal('out', { width_texture, height_texture })}
        ivec4 getOutputTensorPos() {
            // 获取原始长度
            vec2 outCoord = moveTexture2PosToReal_out(vCoord.xy);
            // 材质体系转tensor体系坐标位置
            int x = int(outCoord.x / float(${channel}));
            int c = calMod(int(outCoord.x), ${channel});
            int y = calMod(int(outCoord.y), ${height_shape});
            int b = int(outCoord.y / float(${height_shape}));
            return ivec4(b, c, y, x);
        }
    `;
};

