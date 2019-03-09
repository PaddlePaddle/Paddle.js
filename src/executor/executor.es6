/* eslint-disable */
/**
 * @file GraphExecutor，封装可执行单元
 * @author wangqun@baidu.com
 */
export default class GraphExecutor {

    constructor(model) {
        this.inputs = model.inputs;
        this.outputs  = model.outputs;
        this.attrs = model.attrs;
        this.type = model.type;
        this.finish = false;
        this.next = null;
        this.id = +new Date() + model.type;
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
        console.log(inputs, outputs);
        if (this.type ==='feed') {

        }
        // inst.run('conv2d', {
        //     'length_shape_filter': 4,
        //     'width_shape_filter': 3,
        //     'height_shape_filter': 3,
        //     'channel_filter': 4,
        //     'width_texture_filter': filter.texture_width,
        //     'height_texture_filter': filter.texture_height,
        //     filter,
        //     'length_shape_origin': 4,
        //     'width_shape_origin': 5,
        //     'height_shape_origin': 5,
        //     'channel_origin': 4,
        //     'width_texture_origin': matrix.texture_width,
        //     'height_texture_origin': matrix.texture_height,
        //     origin: matrix,
        //     'width_shape_out': 3,
        //     'height_shape_out': 3,
        //     'channel_out': 4,
        //     'length_shape_out': 4,
        //     'width_texture_out': 3,
        //     'height_texture_out': 3,
        //     'shape_out': [1, 4, 3, 3],
        //     'stride_horizontal': 1,
        //     'stride_vertical': 1,
        //     'pad_left': 1,
        //     'pad_top': 1,
        //     'dilation_horizontal': 2,
        //     'dilation_vertical': 2
        // })
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

/* eslint-enable */