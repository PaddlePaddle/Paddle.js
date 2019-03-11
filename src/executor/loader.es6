/* eslint-disable */
import model from '../../demo/model/model';
import GraphExecutor from './executor';
import IO from './io';
import Runtime from '../../src/runtime/runtime';
/**
 * @file GraphModel，绘制生成model网络
 * @author wangqun@baidu.com
 */
export default class GraphModel  {

    constructor(modelUrl, loadOptions) {

        this.version  = '0.0.1';
        this.handler = 'io.IOHandler';
        this.modelUrl = modelUrl;
        this.loadOptions = loadOptions;
        // op runner
        this.inst = null;
        if (this.loadOptions == null) {
            this.loadOptions = {};
        }
    }


    fetchModel() {
        const path = this.modelUrl;
        let URL_SCHEME_REGEX = /^https?:\/\//;
        let load = null;
        let method = 'post';
        // if (path.match(URL_SCHEME_REGEX) != null) {
        //     let myHeaders = new Headers();
        //     load = new Promise((resolve, reject) => {
        //         fetch(path, {method: method, mode: 'cors', credentials: "include", headers: myHeaders})
        //             .then(response => response.json())
        //             .then(responseData => resolve(responseData))
        //             .then(err => reject(err))
        //     })
        //
        //     this.handler = load;
        // }
        // else {
        //     let json;
        //     let s = document.createElement('script');
        //     s.src = path + '&jsonpCallback=fn';
        //
        //     window.fn = function(data) {
        //         json = data;
        //         console.log(json);
        //     }
        //     //当script被插入文档中时，src中的资源就会开始加载
        //     document.body.appendChild(s);
        //
        //     load = new Promise((resolve, reject) => {
        //
        //         s.onload = function(e) {
        //             resolve(json);
        //         }
        //         s.onerror = function() {
        //             reject(json);
        //         }
        //     });
        //     this.handler = load;
        //
        // }
        this.handler = model;

    }
     load() {
        this.fetchModel();
        // const artifacts = await this.handler.load();
        const artifacts =  this.handler;
        console.log(artifacts);
        const opsMap = this.createOpsMap(artifacts.ops, artifacts.vars);
        console.log(opsMap);
        this.weightMap = this.constructOpsMap(opsMap);
        console.log(this.weightMap);
        // this.weightMap = this.convertTensorMapToTensorsMap(weightMap);
        return true;
    }

    async execute_(inputs, executor, outputs) {
        outputs = outputs || this.outputNodes;
        // if (inputs instanceof Tensor || Array.isArray(inputs)) {
        //     inputs = this.constructTensorMap(inputs);
        // }
        if (executor.type === 'fetch'){
            return;
        }
        const name = executor.outputsName[0];
        const outputsName = this.getTensorAttr(executor.outputsName[0]);
        const inputsName = this.getTensorAttr(executor.inputsName[0]);

        const tensor = this.constructTensor(executor, inputs);
        await executor.execute(tensor, outputsName, this.inst);

        if (executor.next) {
            const id = executor.next;
            const next = this.getTensor(id);
            await this.execute_(inputs, next[0], outputs)
        }

        // if (this.executor.isControlFlowModel || this.executor.isDynamicShapeModel) {
        //     throw new Error(
        //         'The model contains control flow or dynamic shape ops, ' +
        //         'please use executeAsync method');
        // }
        // const result = this.execute(
        //     this.convertTensorMapToTensorsMap(inputs), strictInputCheck, outputs);
        // const keys = Object.keys(result);
        // return (Array.isArray(outputs) && outputs.length > 1) ?
        //     outputs.map(node => result[node]) :
        //     result[keys[0]];
    }

    /**
     * Executes inference for the model for given input tensors.
     * @param inputs
     * @param outputs
     * @returns {*}
     */
    async execute(inputs, outputs) {
        const executor = this.getNetsStart(this.weightMap);
        this.inst = Runtime.init({
            'width_raw_canvas': 512,
            'height_raw_canvas': 512
        });

        await this.execute_(inputs, executor[0], outputs);
        return this.inst;
    }


    predict(inputs, config) {
        return this.execute_(inputs, true, this.outputNodes);
    }

    getTensorAttr(name) {

        return this.handler.vars.filter((item, i) => {
            if (name === item.name)
            return item;
        });
    }

    constructTensor(executor, data) {
        const that = this;
        const outputName = executor.outputsName[0];
        const inputName = executor.inputsName[0]


        const input = executor.inputs;

        const output = executor.outputs;
        Object.keys(output).forEach(function(key){
            output[key] = that.getTensorAttr(output[key][0]);
        });
        Object.keys(input).forEach(function(key){

            if ((key === 'Input') && (inputName === 'pixel')) {
                const pixel = that.getTensorAttr(inputName);
                const io = new IO();
                input[key] = io.fromPixels(data, pixel);
            }
            else {
                input[key] = that.getTensorAttr(input[key][0]);
            }

        });
        const tensor = {
            inputs: input,
            outputs: output,
            attrs: executor.attrs,
            type: executor.type,
            next: executor.next
        }
        // if (name === 'pixel') {
        //     const io = new IO();
        //     inputs = io.fromPixels(inputs, outputsName);
        // }

        return tensor;
    }

    /**
     * Construct Ops Relationship
     * @param ops
     * @returns {*}
     */
    constructOpsMap(ops) {
        return ops.map((item, idx) => {
            const outputsName = item.outputsName[0];
            const next = this.getNextExecutor(ops, outputsName);
            if (next.length > 0) {
                item.next = next[0].id;
            }
            return item;
        });
    }

    /**
     * Get Ops Nets Start Node
     * @param ops
     * @returns {*}
     */
    getNetsStart(ops) {
        return ops.filter((item) => {
            if (item.type === 'feed') {
                return true;
            }
        });
    }

    /**
     * Get Ops Nets Last Node
     * @param ops
     * @returns {*}
     */
    getNetsEnd(ops) {
        return ops.filter((item) => {
            if (item.type === 'fetch') {
                return true;
            }
        });
    }
    getTensor(id) {
        return this.weightMap.filter((item, i) => {
            if (id === item.id)
                return item;
        });
    }

    /**
     * Create Ops Executor Object Map
     * @param ops
     * @returns {*}
     */
    createOpsMap(ops) {
        const firstOps = this.getNetsStart(ops);
        const lastOps = this.getNetsEnd(ops);
        console.log(firstOps);
        return ops.map((item, idx) => {
            const graphExecutor = new GraphExecutor(item);
            console.log(graphExecutor.inputsName);
            return graphExecutor;
        });
    }

    /**
     * Get The Next Executor need Exec
     * @param ops
     * @param id
     * @returns {*}
     */
    getNextExecutor(ops, id) {
        return ops.filter((item, key) => {
            if (id === item.inputsName[0]) {
                return true;
            }
        });
    }


    /**
     * Load a graph model given a URL to the model definition.
     * @param modelUrl
     * @param options
     * @returns {Promise<void>}
     */
    loadGraphModel(modelUrl, options) {
        if (modelUrl == null) {
            throw new Error(
                'modelUrl in loadGraphModel() cannot be null. Please provide a url ' +
                'or an IOHandler that loads the model');
        }
        if (options == null) {
            options = {};
        }

        const model = new GraphModel(modelUrl, options);
        model.load();
        return model;
    }

    /**
     * dispose
     */
    dispose() {
        this.executor.dispose();
    }
}

/* eslint-enable */
