/* eslint-disable */
import Utils from './utils';
import Tensor from './tensor';
/**
 * @file op的数据对象
 * @author yangmingming
 *
 */
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
        'pixel': 'origin',
        'conv2d_0.w_0': 'filter',
        'conv2d_0.tmp_0': 'out',
        'conv2d_1.w_0': 'filter',
        'pool2d_0.tmp_0': 'origin',
        'conv2d_1.tmp_0': 'out'
    }
};
// unique behavior
const opBehavior = {
    conv2d: [
        'needBatch'
    ],
    elementwise_add: [
        'broadcast'
    ]
};
export default class OpData {
    constructor(name, input = {}, output = {}, attrs = {}) {
        this.name = name;
        this.input = input;
        this.output = output;
        this.attrs = attrs;
        // op数据, 当前不扩展
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
        const tensorData = [];
        for (let key in this.input) {
            // 默认取第一个数据
            const data = this.input[key] || [{}];
            tensorData.push(data[0]);
        }
        // unique behavior
        opBehavior[this.name].forEach(behavior => {
            this[behavior](tensorData);
        });
        // 生成tensor对象
        tensorData.forEach(data => {
            let name = names[data.name];
            this.tensor[name] = new Tensor({
                name: name,
                shape: data.shape,
                data: data.data,
                needBatch: data.needBatch || false
            });
        });
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

    needBatch(tensorData = []) {
        tensorData.forEach(data => (data.needBatch = true));
    }

    broadcast(tensorData = []) {
        const x = tensorData[0];
        const y = tensorData[1];
        let small = y;
        if (x.shape.length - y.shape.length < 0) {
            small = x;
        }
        // todo: 默认y的shape length是1, 以后需要实现通用版本
        let shape = Utils.getBroadcastShapeInPaddle(x.shape, y.shape);
        // 填充shape数据
        if (small.shape.length === 1) {
            const result = [];
            small.shape = shape;
            let total = shape.reduce((all, num) => all * num);
            for (let i = 0; i < small.shape[0]; i++) {
                let item = small.data[i];
                for (let j = 0; j < total / shape[0]; j++) {
                    result.push(item);
                }
            }
            small.data = result;
        }
    }

    dispose() {
        this.input = null;
        this.output = null;
        this.attrs = null;
    }
}
