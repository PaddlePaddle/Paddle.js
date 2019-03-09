export default class GraphExecutor {

    constructor(model) {
        this.inputs = model.inputs;
        this.outputs  = model.outputs;
        this.type = model.type;
        this.finish = false;
        this.next = null;
        this.id = +new Date();
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

    execute(inputs, outputs) {
        console.log(inputs, this.type, outputs);
    }
    // set next(id) {
    //     this.next = id;
    //
    // }

    // get next() {
    //     return this.next;
    //
    // }
}

