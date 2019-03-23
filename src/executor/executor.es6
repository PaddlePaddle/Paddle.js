/* eslint-disable */
/**
 * @file GraphExecutor，封装可执行单元
 * @author wangqun@baidu.com
 */
let first = true;
let start;
let end;
let actions = {};
export default class GraphExecutor {

    constructor(model) {
        this.inputs = model.inputs;
        this.outputs  = model.outputs;
        this.attrs = model.attrs;
        this.type = model.type;
        this.finish = false;
        this.next = null;
        this.id = +new Date() + model.type + Math.floor(Math.random() * 10 + 1) + model.idx;
    }

    get inputsName() {

        if (this.type === 'feed') {
            return this.inputs.X;
        }
        else if (this.type === 'batch_norm') {
            return this.inputs.X;
        }
        else if (this.type === 'conv2d') {
            return this.inputs.Input;
        }
        else if (this.type === 'depthwise_conv2d') {
            return this.inputs.Input;
        }
        else if (this.type === 'elementwise_add') {
            return this.inputs.X;
        }
        else if (this.type === 'relu') {
            return this.inputs.X;
        }
        else if (this.type === 'pool2d') {
            return this.inputs.X;
        }
        else if (this.type === 'mul') {
            return this.inputs.X;
        }
        else if (this.type === 'softmax') {
            return this.inputs.X;
        }
        else if (this.type === 'scale') {
            return this.inputs.X;
        }
        else if (this.type === 'fetch') {
            return this.inputs.X;
        }
        return null;
    }

    get outputsName() {
        if (this.type === 'conv2d') {
            return this.outputs.Output;
        }
        else if (this.type === 'depthwise_conv2d') {
            return this.outputs.Output;
        }
        else if (this.type === 'batchnorm') {
            this.outputs.out = this.outputs.Y;
            return this.outputs.Y;
        }
        else {
            return this.outputs.Out;
        }

    }

    execute(inputs, outputs, runtime) {
        console.log(inputs, outputs);
        if (this.type !== 'feed') {
            runtime.run(this.type, inputs);
            if (this.type === 'scale') {
                console.log('时间是：' + (+Date.now() - start));
            }
        } else {
            start = +Date.now();
        }
        // actions[this.type] = actions[this.type] || 0;
        // if ((this.type === 'conv2d' && actions[this.type] < 3) ||
        //     (this.type === 'elementwise_add' && actions[this.type] === 0) ||
        //     (this.type === 'relu' && actions[this.type] === 0) ||
        //     (this.type === 'pool2d' && actions[this.type] === 0)) {
        //     actions[this.type] += 1;
        //     console.log(inputs, outputs);
        //     runtime.run(this.type, inputs);
        // }
    }

}

/* eslint-enable */
