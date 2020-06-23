import ops from './ops';
/**
 * @file 工厂类，生成fragment shader
 * @author yangmingming
 */
export default class Factory {
    constructor(opts) {
        this.defaultOpts = Object.assign({}, opts);
        this.webglVersion = 2;
        this.isFrameBufferSupportFloat = true;
        this.texture2d = 'texture';
    }

    setWebglVersion(vs = 0) {
        this.webglVersion = vs;
        if (vs === 1) {
            this.texture2d = 'texture2D';
        }
    }

    setIsFrameBufferSupportFloat(res = true) {
        this.isFrameBufferSupportFloat = res;
    }

    buildShader(opName, data, runtime = undefined) {
        let result = '';
        result = this.buildPrefix(opName);
        result += this.buildCommon(opName);
        result += runtime !== undefined ? this.buildRuntime(runtime) : '';
        result += this.buildOp(opName);
        data.texture2d = this.texture2d;
        result = this.populateData(result, data);
        return result;
    }

    buildPrefix(opName) {
        if (this.webglVersion === 1) {
            return this.isFrameBufferSupportFloat ? ops.common.prefix : ops.common.prefixHalf;
        }
        return ops.common.prefix2;
    }

    buildCommon(opName) {
        return ops.common.params + ops.common.func;
    }

    buildRuntime(runtime) {
        return `
            int layer_run_time = ${runtime};
        `;
    }

    buildOp(opName) {
        let code = ops.ops[opName].params;
        // 依赖的方法
        let atoms = ops.atoms;
        let confs = ops.ops[opName].confs;
        let dep = confs.dep || [];
        dep.map(item => {
            let func = item.func;
            let data = item.conf;
            let snippet = atoms[func];
            code += this.populateData(snippet, data);
        });
        // 引入 suffix 方法
        code += this.buildSuffix(opName);
        // main方法
        code += ops.ops[opName].func;
        return code;
    }

    buildSuffix(opName) {
        return ops.common.suffix;
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

