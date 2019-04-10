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
        if (this.type === 'batchnorm') {
            this.attrs.Bias = model.inputs.Bias;
            this.attrs.Mean = model.inputs.Mean;
            this.attrs.Scale = model.inputs.Scale;
            this.attrs.Variance = model.inputs.Variance;
        }
        this.type = model.type;
        this.finish = false;
        this.next = null;
        this.id = +new Date() + model.type + Math.floor(Math.random() * 10 + 1) + model.idx;
    }

    get inputsName() {

        if (this.type === 'feed') {
            return this.inputs.X;
        }
        else if (this.type === 'batchnorm' || this.type === 'batch_norm') {
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
        else if (this.type === 'batchnorm' || this.type === 'batch_norm') {
            this.outputs.out = this.outputs.Y;
            return this.outputs.Y;
        }
        else {
            return this.outputs.Out;
        }

    }

    /**
     * 将输入数据和具体op进行关联，触发执行具体每一个op
     * @param inputs
     * @param outputs
     * @param runtime
     */
    execute(inputs, outputs, runtime) {
        if (this.type !== 'feed') {
            runtime.run(this.type, inputs);
            if (this.type === 'scale') {
                console.log('时间是：' + (+Date.now() - start));
            }
        } else {
            start = +Date.now();
        }
    }
}

/* eslint-enable */
