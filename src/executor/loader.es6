/* eslint-disable */
import model from '../../demo/model/model';
import GraphExecutor from './executor';

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

    execute_(inputs, executor, outputs) {
        outputs = outputs || this.outputNodes;
        // if (inputs instanceof Tensor || Array.isArray(inputs)) {
        //     inputs = this.constructTensorMap(inputs);
        // }
        inputs = this.constructTensor(inputs);
        executor.execute(inputs);

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
    execute(inputs, outputs) {
        const executor = this.getNetsStart(this.weightMap);
        return this.execute_(inputs, executor, outputs);
    }


    predict(inputs, config) {
        return this.execute_(inputs, true, this.outputNodes);
    }

    constructTensor(inputs) {

        return inputs.reduce((map, inputName, i) => {
            map[inputName] = inputArray[i];
            console.log(map, inputName, i);
            return map;
        });
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