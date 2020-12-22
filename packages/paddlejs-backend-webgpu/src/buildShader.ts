/**
 * @file build compute shader
 * @author zhangjingyuan
 */

import {ops, atoms, utils} from './ops';

/**
 * build op shader
 * @param {String} name op name
 * @param {Object} data op attrs
 * @returns {String}
 */
export default function buildShader(name, attrs) {
    // 获取正确 op name
    const opName = utils.getExactOpName(name, attrs);

    const glslVersion = '#version 450';
    const paramsCode = genParamsCode(opName, attrs);
    const depsCode = genDepsCode(opName);
    const mainCode = genMainCode(opName, attrs);

    return `
    ${glslVersion}
    ${paramsCode}
    ${depsCode}
    ${mainCode}
    `;
}

/**
 * Generate params code
 * @param {String} opName op name
 * @param {Object} data op attrs
 * @returns {String}
 */
function genParamsCode(opName, data): string {
    return ops[opName].params(data);
}

/**
 * Generate compute shader main code
 * @param {String} opName op name
 * @param {Object} data op attrs
 * @returns {String}
 */
function genMainCode(opName, data): string {
    return populateData(ops[opName].main, data);
}

/**
 * Generate compute shader deps function code
 * @param {String} opName op name
 * @returns {String}
 */
function genDepsCode(opName): string {
    const deps = ops[opName].deps || [];
    return deps
        .reduce((code, dep) => {
            const func = dep.func;
            const conf = dep.conf;
            let importFunc = atoms[func];
            return code + populateData(importFunc, conf);
        }, '');
}

/**
 * Populate code string with data
 * @param {String} content code
 * @param {Object} data op attrs
 * @returns {String}
 */
function populateData(content, data): string {
    let code = content;
    for (let key in data) {
        code = code.replace(new RegExp(key.toUpperCase(), 'g'),
            ((typeof data[key]) === 'undefined') ? 1 : data[key]);
    }
    return code;
}