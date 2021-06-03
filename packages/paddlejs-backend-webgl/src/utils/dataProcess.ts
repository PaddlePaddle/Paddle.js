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

function reduceShape(shape: number[]): number[] {
    let len = shape.length;
    const originShape = [...shape];
    const s = [];
    while (len > 1) {
        originShape.splice(0, 1);
        s.push(originShape.reduce((all, num) => all * num));
        len--;
    }

    return s;
}

function getSizeFromShape(shape: number[]): number {
    return shape.reduce((acc, cur) => acc * cur, 1);
}

export {
    getSizeFromShape,
    nhwc2nchw,
    reduceShape
};
