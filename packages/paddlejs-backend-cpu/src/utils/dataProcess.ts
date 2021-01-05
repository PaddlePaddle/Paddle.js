/**
 * @file data process
 */

function nhwc2nchw(data: number[] | Float32Array, shape: number[]) {
    const N = shape[0];
    const H = shape[1];
    const W = shape[2];
    const C = shape[3];
    const WXC = W * C;
    const HXWXC = H * W * C;
    const nchwData: number[] | Float32Array = [];
    for (let n = 0; n < N; n++) {
        for (let c = 0; c < C; c++) {
            for (let h = 0; h < H; h++) {
                for (let w = 0; w < W; w++) {
                    nchwData.push(data[n * HXWXC + h * WXC + w * C + c]);
                }
            }
        }
    }
    return nchwData;
}

export {
    nhwc2nchw
};
