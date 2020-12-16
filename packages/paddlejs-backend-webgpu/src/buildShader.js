/**
 * @file build compute shader
 * @author zhangjingyuan02
 */

import {ops, atoms, utils} from './ops';

export default function buildShader(name, attrs) {
    const glslVersion = '#version 450';
    const opName = utils.getExactOpName(name, attrs);
    const paramsCode = genParamsCode(opName, attrs);
    const depsCode = genDepsCode(opName);
    const mainCode = genMainCode(opName);
    const shaderCodeWidthoutValue = `
    ${glslVersion}
    ${paramsCode}
    ${depsCode}
    ${mainCode}
    `;
    return populateData(shaderCodeWidthoutValue, attrs);
}

function genParamsCode(opName, data) {
    return ops[opName].params(data);
}

function genMainCode(opName) {
    return ops[opName].main;
}

function genDepsCode(opName) {
    const deps = ops[opName].deps || [];
    return deps
        .reduce((code, dep) => {
            const func = dep.func;
            const conf = dep.conf;
            let importFunc = atoms[func];
            return code + populateData(importFunc, conf);
        }, '');
}

function populateData(result, data) {
    let code = result;
    for (let key in data) {
        code = code.replace(new RegExp(key.toUpperCase(), 'g'),
            ((typeof data[key]) === 'undefined') ? 1 : data[key]);
    }
    return code;
}