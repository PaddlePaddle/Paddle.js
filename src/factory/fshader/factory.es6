import ops from './ops.es6';
import Utils from '../../utils/utils';
/**
 * @file 工厂类，生成fragment shader
 * @author yangmingming
 */

export default class Factory {
    constructor(opts) {
        this.defaultOpts = Object.assign({}, opts);
    }

    async buildShader(opName, data) {
        let result = '';
        result = await this.buildPrefix(opName);
        result += await this.buildCommon(opName);
        result += await this.buildOp(opName);
        result = await this.populateData(result, data);
        return result;
    }

    async buildPrefix(opName) {
        let prefix = '';
        prefix = await Utils.loadShader(ops.common.prefix);
        return prefix;
    }

    async buildCommon(opName) {
        let code = await Utils.loadShader(ops.common.params);
        code += await Utils.loadShader(ops.common.func);
        return code;
    }

    async buildOp(opName) {
        let code = await Utils.loadShader(ops.ops[opName].params);
        // 依赖的方法
        let atoms = ops.atoms;
        let confs = ops.ops[opName].confs;
        let dep = confs.dep || [];
        await Promise.all(dep.map(async (item) => {
            let func = item.func;
            let data = item.conf;
            let snippet = await Utils.loadShader(atoms[func]);
            code += this.populateData(snippet, data);
        }));
        // main方法
        code += await Utils.loadShader(ops.ops[opName].func);
        return code;
    }

    populateData(result, data) {
        let code = result;
        for (let key in data) {
            code = code.replace(new RegExp(key.toUpperCase(), 'g'), data[key]);
        }
        return code;
    }
};

