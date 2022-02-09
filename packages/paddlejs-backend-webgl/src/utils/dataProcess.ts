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

function genFpFloatArr(arr, key) {
    if (arr.length === 0) {
        return '';
    }
    return arr.reduce((acc, cur, index) => {
        const item = `float(${cur})` + (index === arr.length - 1 ? ');' : ',');
        return acc + item;
    }, `float ${key}[${arr.length}] = float[](`);
}


function genFpDataCode(dataArr: number[], key) {
    if (dataArr.length === 1) {
        return `float ${key} = float(${dataArr[0]});`;
    }
    const len = dataArr.length;
    let dataStr = `
        vec${len} ${key} = vec${len}(
    `;

    for (let i = 0; i < len; i++) {
        dataStr += `float(${dataArr[i]}),`;
    }
    dataStr = dataStr.slice(0, -1) + ');';
    return dataStr;
}

function genIntDataCode(dataArr: number[], key) {
    if (dataArr.length === 1) {
        return `int ${key} = int(${dataArr[0]});`;
    }
    const len = dataArr.length;
    let dataStr = `
        ivec${len} ${key} = ivec${len}(
    `;

    for (let i = 0; i < len; i++) {
        dataStr += `${dataArr[i]},`;
    }
    dataStr = dataStr.slice(0, -1) + ');';
    return dataStr;
}

function getSmallestDivisor(number, base) {
    let divisor = base;
    if (number % divisor === 0) {
        return divisor;
    }
    while (divisor < number) {
        if (number % divisor === 0) {
            break;
        }
        divisor++;
    }
    return divisor;
}

export {
    nhwc2nchw,
    getSizeFromShape,
    reduceShape,
    genFpDataCode,
    genFpFloatArr,
    genIntDataCode,
    getSmallestDivisor
};
