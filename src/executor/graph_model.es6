
import model from '../../demo/model/model';
import GraphExecutor from './graph_executor';
/**
 * @file GraphModel，绘制生成model网络
 * @author wangqun@baidu.com
 */
export default class GraphModel  {

    constructor(modelUrl, loadOptions) {
        this.executor = 'GraphExecutor';
        this.version  = 'n/a';
        this.handler = 'io.IOHandler';
        this.modelUrl = modelUrl;
        this.loadOptions = loadOptions;
        if (this.loadOptions == null) {
            this.loadOptions = {};
        }
    }

    get modelVersion() {
        return this.version;
    }

    get inputNodes() {
        return this.executor.inputNodes;
    }

    get outputNodes() {
        return this.executor.outputNodes;
    }

    get inputs() {
        return this.executor.inputs;
    }

    get outputs() {
        return this.executor.outputs;
    }

    get weights() {
        return this.executor.weightMap;
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
    async load() {
        this.fetchModel();
        // if (this.handler.load == null) {
        //     throw new Error(
        //         'Cannot proceed with model loading because the IOHandler provided ' +
        //         'does not have the `load` method implemented.');
        // }
        // const artifacts = await this.handler.load();
        const artifacts = await this.handler;
        console.log(artifacts);
        // const graph = artifacts.modelTopology as tensorflow.IGraphDef;

        // this.version = 2;
        // const weightMap =
        //     io.decodeWeights(artifacts.weightData, artifacts.weightSpecs);
        this.executor = new GraphExecutor(artifacts);
        const weightMap = io.decodeWeights(artifacts.ops, artifacts.vars);
        this.executor.weightMap = this.convertTensorMapToTensorsMap(weightMap);
        return true;
    }

    execute_(inputs, strictInputCheck = true, outputs) {
        outputs = outputs || this.outputNodes;
        if (inputs instanceof Tensor || Array.isArray(inputs)) {
            inputs = this.constructTensorMap(inputs);
        }
        if (this.executor.isControlFlowModel || this.executor.isDynamicShapeModel) {
            throw new Error(
                'The model contains control flow or dynamic shape ops, ' +
                'please use executeAsync method');
        }
        const result = this.executor.execute(
            this.convertTensorMapToTensorsMap(inputs), strictInputCheck, outputs);
        const keys = Object.keys(result);
        return (Array.isArray(outputs) && outputs.length > 1) ?
            outputs.map(node => result[node]) :
            result[keys[0]];
    }

    /**
     * Executes inference for the model for given input tensors.
     * @param inputs
     * @param outputs
     * @returns {*}
     */
    execute(inputs, outputs) {
        return this.execute_(inputs, false, outputs);
    }


    predict(inputs, config) {
        return this.execute_(inputs, true, this.outputNodes);
    }

    constructTensorMap(inputs) {
        // const inputArray = inputs instanceof Tensor ? [inputs] : inputs;
        return inputs.reduce((map, inputName, i) => {
            // map[inputName] = inputArray[i];
            console.log(map, inputName, i);
            return map;
        });
    }

    convertTensorMapToTensorsMap(map) {
        return Object.keys(map).reduce((newMap, key) => {
            newMap[key] = [map[key]];
            return newMap;
        });
    }


    /**
     * Load a graph model given a URL to the model definition.
     * @param modelUrl
     * @param options
     * @returns {Promise<void>}
     */
    async loadGraphModel(modelUrl, options) {
        if (modelUrl == null) {
            throw new Error(
                'modelUrl in loadGraphModel() cannot be null. Please provide a url ' +
                'or an IOHandler that loads the model');
        }
        if (options == null) {
            options = {};
        }

        const model = new GraphModel(modelUrl, options);
        await model.load();
        return model;
    }

    dispose() {
        this.executor.dispose();
    }
}

