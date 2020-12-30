/**
 * @file build compute shader
 * @author yueshuangyan
 */

import { env } from 'paddlejs-core/src';
import { ops } from '../ops';
import { getTensorParams, getExactOpName } from '../ops/utils';
import genPrefixCode from '../ops/atom/prefix';
import genSuffixCode from '../ops/atom/suffix';
import * as commonFunc from '../ops/atom/common_func';
import * as textureFunc from '../ops/atom/common_func_with_texture';

export default function buildShader(textureConf, type, inputTensors, fShaderParams, runtime: number) {
    let code = '';
    try {

        const opName = getExactOpName(type, fShaderParams);

        const { params = {}, mainFunc, textureFuncConf = {}, commonFuncConf } = ops[opName];

        // textureList: [filter, origin, bias]
        const { textureParams, opParams, active_function } = getTensorParams(inputTensors, params, fShaderParams);

        const prefixCode = genPrefixCode(textureConf);

        const textureCode = genTextureFuncCode(textureFuncConf, textureParams, opParams);

        const runtimeCode = genRuntimeCode(runtime);

        const suffixCode = genSuffixCode(textureParams['out'], opParams);


        const commonFuncCode = genCommonFuncCode(commonFuncConf);
        const activeFuncCode = active_function ? commonFunc[active_function] : '';
        const mainCode = mainFunc(textureParams, opParams);

        code
        = `   ${prefixCode}
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
        console.log(e);
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
function genTextureFuncCode(textureFuncConf, textureParams, opParams) {
    if (!textureFuncConf) {
        return '';
    }

    let textureCode = '';
    let samplerCode = '';
    for (const textureName of Object.keys(textureFuncConf)) {
        samplerCode += textureFunc['getSamplerCode'](textureName);
        const funcs = textureFuncConf[textureName];
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
