/* eslint-disable */
/**
 * @file op的数据对象
 * @author yangmingming
 *
 */
import Tensor from './tensor';
const keys = [
    'paddings',
    'strides',
    'dilations'
];
const tensorAttrs = [
    'length_shape',
    'width_shape',
    'height_shape',
    'width_texture',
    'height_texture',
    'channel'
];
// model的名字和paddle web的tensor名字mapping
const tensorName = {
    conv2d: {
        'pixels': 'origin', // testDemo里却失
        'conv2d_0.w_0': 'filter',
        'conv2d_0.tmp_0': 'out'
    }
};
export default class OpData {
    constructor(name, input = {}, output = {}, attrs = {}) {
        this.name = name;
        this.input = input;
        this.output = output;
        this.attrs = attrs;
        // op数据
        this.data = {
            'active_function': 'scale',
            'multi_value': '1.0',
            'bias_value': '0.0'
        };
        // tensor数据
        this.tensor = {};
        this.buildTensor();
        this.buildAttrs();
    }

    buildTensor() {
        // todo: 是否需要形状对齐
        // todo: 是否需要广播tensor
        const names = tensorName[this.name];
        for (let key in this.input) {
            // 默认取第一个数据
            const data = this.input[key] || [{}];
            let name = names[data[0].name];
            this.tensor[name] = new Tensor({
                name: name,
                shape: data[0].shape,
                data: data[0].data
            });
        }
    }

    buildAttrs() {
        keys.forEach(key => {
            const item = this.attrs[key] || [0 , 0];
            this.data[key + '_x'] = item[0];
            this.data[key + '_y'] = item[1];
        });
        // 获取tensor的数据
        for (let key in this.tensor) {
            const tensor = this.tensor[key];
            tensorAttrs.forEach(attr => {
                this.data[attr+ '_' + tensor.name] = tensor[attr];
            });
        }
    }

    get data() {
        return data;
    }

    dispose() {
        this.input = null;
        this.output = null;
        this.attrs = null;
    }
}
