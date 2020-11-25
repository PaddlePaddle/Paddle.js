/**
 * @file build compute shader
 * @author zhangjingyuan02
 */

import ops from './ops';

export default function buildShader(opName, data) {
    let result = '#version 450';
    result += buildOp(opName);
    result = populateData(result, data);
    return result;
}

function buildOp(opName) {
    let code = ops[opName].params;
    // main方法
    code += ops[opName].main;
    return code;
}
    
function populateData(result, data) {
    let code = result;
    for (let key in data) {
        code = code.replace(new RegExp(key.toUpperCase(), 'g'),
            ((typeof data[key]) === 'undefined') ? 1 : data[key]);
    }
    return code;
}