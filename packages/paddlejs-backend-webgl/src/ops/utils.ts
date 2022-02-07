/**
 * @file op 相关辅助函数
 * @author yueshuangyan
 */

import { Tensor } from '../types';

interface opInfo {
    [key: string]: any
}

const tensorParams = [
    'length_shape',
    'length_unformatted_shape',
    'width_shape',
    'height_shape',
    'width_texture',
    'height_texture',
    'offset_x',
    'offset_y',
    'channel',
    'total_shape',
    'numbers_shape'
];


const baseParams = {
    float: [
        'multi_value',
        'bias_value'
    ],
    bool: [
        'fuse_relu'
    ]
};

function getTensorParams(tensors: Tensor[], fShaderParams: object, runtime: number): opInfo {
    const tensorsParams = {};
    const opParams = Object.assign({}, fShaderParams);
    const tensorNames = [] as string[];
    // tensorParams
    for (const tensor of tensors) {
        const name = tensor.name;
        // 提取inputParams
        const tensorVars = {};
        for (const param of tensorParams) {
            if (typeof (tensor[param]) !== 'undefined') {
                tensorVars[param] = tensor[param];
            }
        }

        tensorsParams[name] = tensorVars;
        tensorNames.push(name);
    }

    // baseParams
    for (const type of Object.keys(baseParams)) {
        const params = baseParams[type];
        for (const param of params) {
            if (typeof (fShaderParams[param]) !== 'undefined') {
                opParams[param] = `${type}(${fShaderParams[param]})`;
            }
        }
    }

    // 将active_function放在opParams中
    if (fShaderParams['active_function']) {
        opParams['active_function'] = fShaderParams['active_function'];
    }

    opParams['runtime'] = runtime;

    return { textureParams: tensorsParams, opParams, active_function: fShaderParams['active_function'] };
}

export {
    getTensorParams
};
