/* eslint-disable */
import GraphExecutor from './executor';
import IO from '../feed/imageFeed';
import Runtime from '../../src/runtime/runtime';
import OpData from '../utils/opData';
import Factory from '../factory/fshader/factory';
/**
 * @file GraphModel，绘制生成model网络
 * @author wangqun@baidu.com
 */

// 生成factory实例
const factory = new Factory({});
// 获取op的输入配置
const opConfs = factory.getOpConfs();

export default class GraphModel  {

    constructor(modelUrl, loadOptions) {

        this.version  = '0.0.1';
        this.handler = '';
        this.modelUrl = modelUrl;
        this.loadOptions = loadOptions;
        this.multipart = false;
        // feed数据
        this.feed = null;
        this.index = 0;
        this.feedOp = null;
        this.feedItem = null;
        this.isExecuted = false;
        this.params = {type: 'xhr'};
        // 设置分片加载model
        if (this.loadOptions) {
            this.multipart = this.loadOptions.multipart;
            this.feed = {input: this.loadOptions.feed};
        }
        // op runner
        this.inst = Runtime.init({
            'width_raw_canvas': 512,
            'height_raw_canvas': 512
        });
        if (this.loadOptions === null) {
            this.loadOptions = {};
        }
    }

    fetchData(name, model) {
        const path = '/mobileNet/' + name + '.json';
        let load = new Promise((resolve, reject) => {
            fetch(path, {
                method: 'get', mode: 'cors', credentials: "include",
                headers: { 'Content-Type': 'application/json;charset=utf-8'}})
                .then(response => response.json())
                .then(responseData => resolve(responseData))
                .then(err => reject(err))
        })
        return load;
    }

    async traverse (arr, idx) {
        let len = arr.length;
        let that = this;
        if (arr.length <= idx) {
            return arr;
        }
        else {
            if (arr[idx] && arr[idx].name) {
                let TMP_SCHEME_REGEX = /\.tmp/;
                let TMP_REGEX = /\-/;
                if ( arr[idx].name.match(TMP_SCHEME_REGEX) === null
                && arr[idx].name.match(TMP_REGEX) === null
                ) {
                    arr[idx].data = await this.fetchData(arr[idx].name);
                }
                await this.traverse (arr, ++idx);
            }

        }
    }

    fetchModel(params) {
        params = params || this.params;
        const path = this.modelUrl;
        let URL_SCHEME_REGEX = /^https?:\/\//;
        let load = null;
        let method = params.method || 'get';
        let mode = params.mode || 'cors';
        // jsonp请求方式
        if (params && params.type === 'jsonp') {
            let json;
            let s = document.createElement('script');
            s.src = path + '&jsonpCallback=fn';

            window.fn = function(data) {
                json = data;
                console.log(json);
            };
            //当script被插入文档中时，src中的资源就会开始加载
            document.body.appendChild(s);

            load = new Promise((resolve, reject) => {

                s.onload = function(e) {
                    resolve(json);
                }
                s.onerror = function() {
                    reject(json);
                }
            });
            this.handler = load;

        }
        else if (params.type === 'xhr') {
            let myHeaders = new Headers();
            load = new Promise((resolve, reject) => {
                fetch(path, {
                    method: method,
                    mode: mode,
                    credentials: "include",
                    headers: myHeaders
                })
                .then(response => response.json())
                .then(responseData => resolve(responseData))
                .then(err => reject(err))
            });
            this.handler = load;
        }

        return load;

    }
    async load() {
        let that = this;
        const artifacts = this.handler =  await this.fetchModel();
        if (this.multipart === true) {
            let idx = 0;
            let arti = await that.traverse(artifacts.vars, idx);
        }
        const opsMap = this.createOpsMap(artifacts.ops, artifacts.vars);

        this.weightMap = this.constructOpsMap(opsMap);
        // 生成op数据
        this.weightMap.forEach(op => {
            const type = op.type;
            if (type !== 'feed' && type !== 'fetch') {
                that.buildOpData(op);
            }
        });
        return true;
    }

    buildOpData(op) {
        const tensor = this.constructTensor(op);
        const opData = new OpData(op.type, tensor.inputs, tensor.outputs, tensor.attrs);
        const name = opData.name;
        const fsCode = factory.buildShader(name, opData.data);
        opData.fshader = this.inst.createFragmentShader(fsCode);
        opData.renderData = opConfs[name].map(elem => {
            let item = Object.assign({}, elem);
            const tensorData = opData.tensor[item.tensor];
            if (item.type === 'texture') {
                item.data = tensorData.data;
                if (this.feedOp.id === op.id) {
                    this.feedItem = item;
                }
                item['width_texture'] = tensorData['width_texture'];
                item['height_texture'] = tensorData['height_texture'];
            } else if (item.type === 'uniform') {
                item.data = tensorData[item.variable];
            }
            return item;
        });
        op.opData = opData;
        // delete op.inputs;
        // delete op.outputs;
        // delete op.attrs;
    }

    execute_(executor) {
        if (executor.type === 'fetch') {
            return;
        }
        executor.execute(this.inst);

        if (executor.next) {
            const id = executor.next;
            const next = this.getTensor(id);
            this.execute_(next[0])
        }
    }

    /**
     * Executes inference for the model for given input tensors.
     * @param inputs
     * @param outputs
     * @returns {*}
     */
    execute(inputs) {
        this.feed = inputs;
        const executor = this.getNetsStart(this.weightMap);
        if (!this.inst) {
            this.inst = Runtime.init({
                'width_raw_canvas': 512,
                'height_raw_canvas': 512
            });
        }
        if (this.isExecuted) {
            this.updateFeed();
        }
        let start = +Date.now();
        this.execute_(executor[0]);
        console.log('总的执行时间是' + (+Date.now() - start));
        this.isExecuted = true;
        return this.inst;
    }

    updateFeed() {
        this.feedItem.data = new Float32Array(this.feed.input[0].data);
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

    constructTensor(executor) {
        const that = this;
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
            else if ((key === 'Input') && (inputName === 'image')) {
                input[key] = that.feed.input;
                that.feedOp = executor;
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
        };

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
        return ops.map((item, idx) => {
            item.idx = idx;
            const graphExecutor = new GraphExecutor(item);
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

    /**
     * dispose
     */
    dispose() {
        this.executor.dispose();
    }
}

/* eslint-enable */
