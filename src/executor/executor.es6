/* eslint-disable */
/**
 * @file GraphExecutor，封装可执行单元
 * @author wangqun@baidu.com
 */
let first = true;
export default class GraphExecutor {

    constructor(model) {
        this.inputs = model.inputs;
        this.outputs  = model.outputs;
        this.attrs = model.attrs;
        this.type = model.type;
        this.finish = false;
        this.next = null;
        this.id = +new Date() + model.type + Math.floor(Math.random() * 10 + 1);
    }

    get inputsName() {
        if (this.type === 'feed') {
            return this.inputs.X;
        }
        else if (this.type === 'conv2d') {
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
        else {
            return this.outputs.Out;
        }

    }

    async execute(inputs, outputs, runtime) {
        if (this.type === 'conv2d' && first) {
            first = false;
            console.log(inputs, outputs);
            await runtime.run(this.type, inputs);
        }
    }

}

/* eslint-enable */
