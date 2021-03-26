/**
 * @file  mul
 */

import { reduceShape } from '../../utils/dataProcess';
function reshapeTo2D(src, num_col_dims) {
    const [n, c, h, w] = src;
    // 小于等于二维
    if (n === 1 && c === 1) {
        return [
            [1, 1, h],
            3,
            [w],
            1,
            [h, w]
        ];
    }

    const part1 = src.slice(0, num_col_dims);
    const part2 = src.slice(num_col_dims);

    return [
        part1,
        part1.length,
        part2,
        part2.length,
        [part1.reduce((all, num) => all * num), part2.reduce((all, num) => all * num)]
    ];
}

function  getTensorPosFromArrayIndex(name, numbers_shape, length_shape) {
    if (length_shape === 1) {
        return `
            int getTensorPosFromArrayIndex_${name}(int n) {
                return int(mod(float(n), float(${numbers_shape[0]})));
            }
        `;
    }

    const shape = reduceShape(numbers_shape);
    shape.push(1);
    const shapeVec = `ivec${length_shape}(${shape.join(', ')})`
    return `
    ivec${length_shape} shapeVec_${name} = ${shapeVec};
    ivec${length_shape} getTensorPosFromArrayIndex_${name}(int n) {
        ivec${length_shape} pos;
        pos[0] = n / shapeVec_${name}[0];
        for (int i = 1; i < ${length_shape}; i++) {
            n = int(mod(float(n), float(shapeVec_${name}[i - 1])));
            pos[i] = n / shapeVec_${name}[i];
        }
        return pos;
    }
    `;
}

function getVecType(len) {
    return len === 1 ? 'int' : 'ivec' + len;
}

function recoverShape({ total_shape, channel, height_shape, width_shape }) {
    return [total_shape / channel / height_shape / width_shape, channel, height_shape, width_shape];
}

function mainFunc(
    { origin, counter },
    { x_num_col_dims, y_num_col_dims }
) {
    // flatten
    const xShape = recoverShape(origin);
    const yShape = recoverShape(counter);

    const [x1, x1Len, x2, x2Len, x2d] = reshapeTo2D(xShape, x_num_col_dims);
    const [y1, y1Len, y2, y2Len] = reshapeTo2D(yShape, y_num_col_dims);

    const getTensorPosFromArrayIndex_x1 = getTensorPosFromArrayIndex('x1', x1, x1Len);
    const getTensorPosFromArrayIndex_x2 = getTensorPosFromArrayIndex('x2', x2, x2Len);
    const getTensorPosFromArrayIndex_y1 = getTensorPosFromArrayIndex('y1', y1, y1Len);
    const getTensorPosFromArrayIndex_y2 = getTensorPosFromArrayIndex('y2', y2, y2Len);

    return `
    ${getTensorPosFromArrayIndex_x1}
    ${getTensorPosFromArrayIndex_x2}
    ${getTensorPosFromArrayIndex_y1}
    ${getTensorPosFromArrayIndex_y2}

    // start函数
    void main(void) {
        float res = 0.0;
        // 获取output的坐标
        ivec4 opos = getOutputTensorPos();
        float temp = 0.0;

        // output is 2D
        int b = opos.b;
        int a = opos.a;

        ${getVecType(x1Len)} x1 = getTensorPosFromArrayIndex_x1(b);
        ${getVecType(y2Len)} y2 = getTensorPosFromArrayIndex_y2(a);

        for (int j = 0; j < ${x2d[1]}; j++) {
            ${getVecType(x2Len)} x2 = getTensorPosFromArrayIndex_x2(j);
            ${getVecType(y1Len)} y1 = getTensorPosFromArrayIndex_y1(j);

            ivec4 xPos = ivec4(${getVecType(x1Len)}(x1), ${getVecType(x2Len)}(x2));
            ivec4 yPos = ivec4(${getVecType(y1Len)}(y1), ${getVecType(y2Len)}(y2));

            float o = getValueFromTensorPos_origin(xPos.r, xPos.g, xPos.b, xPos.a);
            float c = getValueFromTensorPos_counter(yPos.r, yPos.g, yPos.b, yPos.a);
            res += c * o;
        }

        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    params: [
        'x_num_col_dims',
        'y_num_col_dims'
    ],
    textureFuncConf: {
        counter: ['getValueFromTensorPos'],
        origin: ['getValueFromTensorPos']
    },
    behaviors: [
    ]
};
