import ops from './ops';
import Utils from '../../utils/utils';
/**
 * @file 工厂类，生成fragment shader
 * @author yangmingming
 */
const snippets = {};
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
        let prefix = snippets.prefix || '';
        if (!prefix) {
            prefix = await Utils.loadShader(ops.common.prefix);
            snippets.prefix = prefix;
        }
        return prefix;
    }

    async buildCommon(opName) {
        if (!snippets.common) {
            snippets.common = {};
            snippets.common.params = await Utils.loadShader(ops.common.params);
            snippets.common.func = await Utils.loadShader(ops.common.func);
        }
        return snippets.common.params + snippets.common.func;
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
            code = code.replace(new RegExp(key.toUpperCase(), 'g'),
                ((typeof data[key]) === 'undefined') ? 1 : data[key]);
        }
        return code;
    }

    getOpConfs() {
        const opsConfs = {};
        for (let key in ops.ops) {
            if (ops.ops.hasOwnProperty(key)) {
                opsConfs[key] = ops.ops[key].confs.input;
            }
        }
        return opsConfs;
    }
}

