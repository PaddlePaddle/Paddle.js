/**
 * @file common utils
 */

import { env } from '@paddlejs/paddlejs-core';


enum ArrTypeEnum {
    INT_TYPE = 'int',
    FLOAT_TYPE = 'float'
}

// GLSL ES 3.00 支持 arr =>  int arr = int[](x, x, x,... x);
// GLSL ES 1.0 (1.0) 不支持  array constructor
// '[]' : array constructor supported in GLSL ES 3.00 and above only
const initializeGLSLArr = (arr: Array<Number>, type: ArrTypeEnum) => {
    if (env.get('webglVersion') !== 2) {
        return arr.reduce((acc, cur, index) => {
            const tmp = index < arr.length - 1 ? `${cur}, ` : `${cur});`;
            return acc + tmp;
        }, `${type} arr[] = ${type}[](`);
    }

    const arr_value = arr.reduce((acc, cur, index) => {
        return acc + `
            arr[${index}] = ${cur};`;
    }, '');

    return `
        ${type} arr[${arr.length}];
        ${arr_value}
    `;
};

export {
    initializeGLSLArr,
    ArrTypeEnum
};