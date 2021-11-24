/**
 * @file get the postion of tensor specifically index in tensor array
 * @author yueshuangyan
 */

export default function (tensorName: string, { numbers_shape, length_shape }) {
    return `
    i${length_shape} getTensorPosFromArrayIndex_${tensorName}(int n) {
        i${length_shape} pos;
        pos[0] = n / ${numbers_shape}[0];
        for (int i = 1; i < ${length_shape}; i++) {
            n = calMod(n, ${numbers_shape}[i - 1]);
            pos[i] = n / ${numbers_shape}[i];
        }
        return pos;
    }
    `;
}
