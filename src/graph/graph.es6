/* eslint-disable */
import GraphExecutor from '../executor/executor';
import Runtime from '../runtime/runtime';
import OpData from '../utils/opData';
import Factory from '../factory/fshader/factory';
import Utils from '../utils/utils';

/**
 * @file Graph，绘制生成model网络
 * @author wangqun@baidu.com
 */
// 生成factory实例
const factory = new Factory({});
// 获取op的输入配置
const opConfs = factory.getOpConfs();
let opindex = 0;

export default class Graph {
    constructor(options) {
        this.version  = '0.0.1';
        this.handler = 'io.IOHandler';
        this.weightMap = '';
        this.options = options || {};
        // feed数据
        this.feed = null;
        this.index = 0;
        this.feedOp = null;
        this.feedItem = null;
        this.test = false;
        this.formatLayout = 'NCHW';
        this.isExecuted = false;
        // 网络层数
        this.iLayer = 0;

        if (this.options && this.options.options ) {
            if (this.options.options.test === true) {
                this.test = true;
            }
            if (this.options.options.formatLayout) {
                this.formatLayout = this.options.options.formatLayout;
            }

        }

        if (!this.inst) {
            // op runner
            this.inst = Runtime.init();
            factory.setWebglVersion(this.inst.getWebglVersion());

        }
    }

    buildOpData(op) {
        const executor = this.constructExecutor(op);
        const opData = new OpData(op.type, executor.inputs, executor.outputs, executor.attrs);
        const name = opData.name;

        opData.program = [];
        opData.program = opData.outputTensors.map((outTensor, index) => {
            const fsCode = factory.buildShader(name, opData.fShaderParams[index], index);
            return this.inst.createProgram(fsCode, outTensor);
        });

        opData.renderData = opConfs[name].map(elem => {
            let item = Object.assign({}, elem);
            const tensorData = opData.inputTensors.find(tensor => tensor.name === item.tensor);
            if (item.type === 'texture') {
                item.tensorId = tensorData.opts.type;
                item.data = tensorData.data;
                if (this.feedOp.id === op.id && item.tensor === 'origin') {
                    item.shape = tensorData.shape;
                    this.feedItem = item;
                }
                item['width_texture'] = tensorData['width_texture'];
                item['height_texture'] = tensorData['height_texture'];
                item['channel'] = tensorData['channel'];
            } else if (item.type === 'uniform') {
                item.data = tensorData[item.variable];
            }
            return item;
        });
        // console.timeEnd('opData.renderData');
        opData.iLayer = this.iLayer++;
        op.opData = opData;
        // delete op.inputs;
        // delete op.outputs;
        // delete op.attrs;
    }
    execute_(executor) {
        if (executor.type === 'fetch') {
            return;
        }
        opindex++;
        console.log(opindex);
        //if (executor.opData) console.log(executor.opData.iLayer);
        executor.execute(this.inst, this.isExecuted);
        if (false && executor.opData && opindex >= 184){
            console.log('return!');
            console.dir(executor);
            console.dir(executor.type);
            console.dir(this);
            return;
        }
        if (executor.next) {
            const id = executor.next;
            const next = this.getTensor(id);
            this.execute_(next[0]);
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
        console.log('this.weightMap');
        console.dir(this.weightMap);
        const executor = this.getNetsStart(this.weightMap);
        console.dir(executor);
        if (!this.inst) {
            this.inst = Runtime.init({
                'width_raw_canvas': 512,
                'height_raw_canvas': 512
            });
        }
        if (this.isExecuted) {
            this.updateFeed();
        }
        this.execute_(executor[0]);
        this.isExecuted = true;
        return this.inst;
    }
    updateFeed() {
        this.feedItem.data = this.feed.input[0].data;
        // Utils.img2texture(this.feedItem);
    }
    /**
     * predict enter
     * @param inputs
     * @param config
     */
    predict(inputs, config) {
        return this.execute_(inputs, true, this.outputNodes);
    }
    getTensorAttr(name) {
        return this.data.vars.filter((item, i) => {
            if (name === item.name)
            return item;
        });
    }
    constructExecutor(executor) {
        let that = this;
        const inputName = executor.inputsName[0];
        const input = executor.inputs;
        const output = executor.outputs;
        Object.keys(output).forEach(function(key){
            output[key].forEach((item, index) => {
                output[key][index] = that.getTensorAttr(item)[0];
            });
        });
        Object.keys(input).forEach(function(key){
            if (that.test && ((key === 'Input') || (key === 'X'))) {
                input[key] = that.getTensorAttr(input[key][0]);
                that.feedOp = executor;
            }
            else if ((key === 'Input') && (inputName === 'pixel')) {
                // const pixel = that.getTensorAttr(inputName);
                // const io = new IO();
                // input[key] = io.fromPixels(that.feed, pixel);
                input[key] = that.feed.input;

                that.feedOp = executor;
            }
            else if ((key === 'Input') && (inputName === 'image' || inputName === 'x')) {
                // that.feed.input[0].data = that.testData;
                input[key] = that.feed.input;

                that.feedOp = executor;
            }
            else {
                input[key] = that.getTensorAttr(input[key][0]);
            }
        });
        // console.log(input);
        return {
            inputs: input,
            outputs: output,
            attrs: executor.attrs,
            type: executor.type,
            next: executor.next
        };
    }
    /**
     * Construct Ops Relationship
     * @param ops
     * @returns {*}
     */
    constructOpsMap(ops) {
        return ops.map((item, idx) => {
            const outputsName = item.outputsName[0];
            console.log(item);
            const next = this.getNextExecutor(ops, outputsName);
            console.log(next);
            if (next.length > 0) {
                item.next = next[0].id;
            }
            return item;
        });
    }

    execute_try(temp, ops, idtoindex, executed, inline, prev){
        console.log('execute_try!first look at this op');
        console.log(ops[temp]);
        let canrun = this.checkifcanrun(temp, ops, idtoindex, executed);
        if (canrun === false) {
            console.log('canrun === false!');
            var a = inline.pop();
            this.execute_try(idtoindex[a.id], ops, idtoindex, executed, inline, prev);
            return;
        }
        if (prev >=0) {
            ops[prev].next = ops[temp].id;
        }
        ops[temp].outputsName.forEach(function(item, index) {
            executed[item] = true;
        })
        let next = this.getNextByOp(ops, ops[temp]);
        console.log('this is its next:');
        console.dir(next);
        while (next.length === 1) {
            let flag = true;
            for (let i = 0; i < next[0].inputsName.length; i++){
                if (executed[next[0].inputsName[i]] === false) flag = false;
            }
            if (flag === false) {
                console.log('can not execute next now! jump to another op:');

                if (inline.length === 0) return;
                prev = temp;
                let a = inline.pop();
                console.dir(a);
                ops[temp].next = a.id;
                temp = idtoindex[a.id];
                this.execute_try(temp, ops, idtoindex, executed, inline, prev);
                return;
            }
            else {
                console.log('now execute next op! it is');
                ops[temp].next = next[0].id;
                temp = idtoindex[next[0].id];
                console.dir(ops[temp]);
                next = this.getNextByOp(ops, ops[temp]);
                console.log('its next is: ');
                ops[temp].outputsName.forEach(function(item, index) {
                    executed[item] = true;
                })
                console.dir(next);
            }
        }
        if (next.length > 1){
            console.log('next.length > 1!!!');
            for (let i = next.length - 1; i >=0 ; i--){
                 inline.push(next[i]);
            }

            var a = inline.pop();
            this.execute_try(idtoindex[a.id], ops, idtoindex, executed, inline, temp);
        }
        return;
    }


    arrangeMap(ops) {
        console.log('arrangeMap!');
        console.dir(ops);
        var idtoindex = {};
        var executed = {};
        var inline = [];
        let temp = 0;
        console.log('graph ops:');
        console.dir(ops);
        let ops1 = ops;
        ops1.forEach(function(item, index) {
            idtoindex[item.id] = index;
            console.dir(item);
            item.outputsName.forEach(function(i, idx){
                executed[i] = false;
            })
        });

        //ops[0].inputsName[0] = {name : "feed"};
       // ops[0].outputsName[0] = {name : "image"};
        this.execute_try(temp, ops, idtoindex, executed, inline, -1);
        return ops;
    }

    checkifcanrun(temp, ops, executed){
        if (!ops[temp].inputsName) return true;
        for (let i = 0; i < ops[temp].inputsName.length; i++){
                if (executed[ops[temp].inputsName[i]] === false)  return false;
        }
        return true;
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
     * get tensor by id
     * @param id
     * @returns {*}
     */
    getTensor(id) {
        return this.weightMap.filter((item, i) => {
            if (id === item.id)
                return item;
        });
    }
    formatWeight(vars) {
        if (this.formatLayout === 'NHWC') {
            vars.map((item) => {
                if (item.data && item.shape) {
                    item.data =  Utils.nhwc2nchw(item.data, item.shape);
                }
            });
        }
    };
    /**
     * Create Ops Executor Object Map
     * @param ops
     * @returns {*}
     */
    createOpsMap(ops) {
        console.log('ops!!');
        console.dir(ops);
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
            for (let i = 0; i < item.inputsName.length; i++) {
                if (id === item.inputsName[i]) {
                    return true;
                }
            }
        });
    }

    getNextByOp(ops, op) {
        return ops.filter((item, key) => {
            for (let i = 0; i < item.inputsName.length; i++) {
                for(let j = 0; j < op.outputsName.length; j++) {
                    if (item.inputsName[i] === op.outputsName[j]) {
                        return true;
                    }
                }
            }
        });
    }
    /**
     * dispose
     */
    dispose() {
        this.executor.dispose();
    }
}
/* eslint-enable */
