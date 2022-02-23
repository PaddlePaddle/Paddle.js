/**
 * @file build compute shader
 * @author yueshuangyan
 */

import { env } from '@paddlejs/paddlejs-core';
import { getTensorParams } from '../ops/utils';
import genPrefixCode from '../ops/atom/prefix';
import genSuffixCode from '../ops/atom/suffix';
import genFuseOpCode from '../ops/atom/fuse_ops';
import genPrecisionCode from '../ops/atom/precision';
import * as commonFunc from '../ops/atom/common_func';
import * as textureFunc from '../ops/atom/common_func_with_texture';

export default function buildShader(textureConf, op, tensors, fShaderParams, runtime: number) {
    let code = '';
    const { name, mainFunc, textureFuncConf = {}, commonFuncConf } = op;
    try {
        // textureList: [filter, origin, bias]
        const { textureParams, opParams, active_function } = getTensorParams(
            tensors, fShaderParams, runtime
        );

        const precisionCode = genPrecisionCode();

        const prefixCode = genPrefixCode(textureConf);

        const fuseOpCode = genFuseOpCode(opParams);

        const textureCode = genTextureFuncCode(textureFuncConf, textureParams, opParams, tensors);

        const runtimeCode = genRuntimeCode(runtime);

        const suffixCode = genSuffixCode(textureParams['out']);


        const commonFuncCode = genCommonFuncCode(commonFuncConf);
        const activeFuncCode = active_function ? commonFunc[active_function] : '';
        const mainCode = mainFunc(textureParams, opParams);

        code
        = ` ${precisionCode}
            ${fuseOpCode}
            ${prefixCode}
            ${commonFuncCode}
            ${activeFuncCode}
            ${textureCode}
            ${runtimeCode}
            ${suffixCode}
            ${mainCode}
        `;

        code = populateData(code);
    }
    catch (e) {
        console.error(`[${name}]: ` + e);
    }

    return code;
}

function genRuntimeCode(runtime) {
    if (runtime === undefined) {
        return '';
    }
    return `
        int layer_run_time = ${runtime};
    `;
}

function genCommonFuncCode(commonFuncConf) {
    if (!commonFuncConf) {
        return '';
    }

    let code = '';

    for (const func of commonFuncConf) {
        if (commonFunc[func]) {
            code += commonFunc[func];
        }
    }
    return code;
}
function genTextureFuncCode(textureFuncConf, textureParams, opParams, tensors) {
    if (!textureFuncConf) {
        return '';
    }

    const funcConf = Object.assign({}, textureFuncConf);
    if (funcConf['@all']) {
        dealAllInputTensors(funcConf, tensors);
    }
    let textureCode = '';
    let samplerCode = '';
    for (const textureName of Object.keys(funcConf)) {
        if (!textureParams[textureName]) {
            continue;
        }
        samplerCode += textureFunc['getSamplerCode'](textureName);
        const funcs = funcConf[textureName];
        for (const funcName of funcs) {
            if (textureFunc[funcName]) {
                try {

                    textureCode += textureFunc[funcName](textureName, textureParams[textureName], opParams);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    }

    return `
    ${samplerCode}
    ${textureCode}
    `;
}

function populateData(result: string): string {
    // 全局替换TEXTURE2D
    const glVersion = env.get('webglVersion');
    const texture2d = glVersion === 1 ? 'texture2D' : 'texture';
    return result.replace(/\bTEXTURE2D\b/g, texture2d);
}

function dealAllInputTensors(textureFuncConf, tensors) {
    // get all input tensors
    const inputTensors = tensors.filter(tensor => tensor.name !== 'out');
    const funcArr = textureFuncConf['@all'];
    inputTensors.forEach(tensor => {
        const name = tensor.name;
        if (textureFuncConf[name]) {
            textureFuncConf[name].concat(funcArr);
        }
        else {
            textureFuncConf[name] = funcArr;
        }
    });
    delete textureFuncConf['@all'];
}
