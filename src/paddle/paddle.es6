/* eslint-disable */
import 'babel-polyfill';
import Loader from '../loader/loader';
import Graph from '../graph/graph';
/**
 * @file GraphModel，绘制生成model网络
 * @author wangqun@baidu.com
 */

export default class Paddle {
    constructor(options) {
        this.version  = '0.0.1';
        this.loader = '';
        this.options = options;
        this.graph = '';
        this.multipart = false;
        // feed数据
        this.feed = null;
        this.index = 0;
        this.feedOp = null;
        this.feedItem = null;
        this.test = false;
        this.isExecuted = false;
        // 网络层数
        this.iLayer = 0;
        // fetch xhr jsonp
        this.params = {type: 'fetch'};
    }

    async load() {

        if (this.options === null) {
            // todo saniac 报错提示修改
            throw new Error(
                'modelGonfig in loadGraphModel() cannot be null. Please provide a url ' +
                'or an IOHandler that loads the model');
        }

        const model = new Loader(this.options.urlConf, this.options.options);
        await model.load();
        this.preGraph(model);
        return this;

    }
    preGraph (artifacts) {
        let that = this;
        const graph = new Graph(that.options);
        that.graph = graph;
        that.graph.data = artifacts.data;
        that.graph.formatWeight(that.graph.data.vars);
<<<<<<< HEAD
        const opsMap = that.graph.createOpsMap(that.graph.data.ops);
        const opsMap1 = that.graph.constructOpsMap(opsMap);
        const opsMap2 = that.graph.arrangeMap(opsMap1);
=======
        const opsMap = that.graph.createOpsMap(that.graph.data.ops, that.graph.data.vars);
        const opsMap1 = that.graph.constructOpsMap(opsMap);
        // console.log('opsMap1!');
        // console.dir(opsMap1);
        const opsMap2 = that.graph.arrangeMap(opsMap1);
        // console.log('opsMap2!');
        // console.dir(opsMap2);
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
        that.graph.weightMap = opsMap2;
    }
    /**
     * Executes inference for the model for given input tensors.
     * @param inputs
     * @param outputs
     * @returns {*}
     */
    execute(inputs) {
        let that = this;
        this.feed = this.graph.feed = inputs;
        // 生成op数据
        if (!this.graph.isExecuted) {
<<<<<<< HEAD
            this.graph.weightMap.forEach((op, index) => {
                const type = op.type;
                if (type !== 'feed' && type !== 'fetch') {

=======
            this.graph.weightMap.forEach(op => {
                const type = op.type;
                if (type !== 'feed' && type !== 'fetch') {
                    console.log(op.type);
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
                    that.graph.buildOpData(op);
                }
            });
        }
        this.graph.execute(inputs);
        return this.graph.inst;
    }
    updateFeed() {
        this.graph.feedItem.data = this.graph.feed.input[0].data;
<<<<<<< HEAD
=======
        // Utils.img2texture(this.graph.feedItem);
>>>>>>> 6c40834f2e1ff1fcfd564d2aeaa1f4c2724fe8ee
    }
    /**
     * dispose
     */
    dispose() {
        this.graph.dispose();
    }
}
/* eslint-enable */
