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
    'dilations',
    'ksize'
];
// 从tensor对象中获取的数据
const tensorAttrs = [
    'length_shape',
    'width_shape',
    'height_shape',
    'width_texture',
    'height_texture',
    'channel'
];
// shader中需要的常量
const shaderAttrs = {
    scale: {
        'bias': 'bias_value',
        'scale': 'multi_value'
    },
    pool2d: {
        'pooling_type': 'type_pool'
    }
};
// model的名字和paddle web的tensor名字mapping
const tensorName = {
    conv2d: {
        'pixel': 'origin',
        'conv2d_0.w_0': 'filter',
        'conv2d_0.tmp_0': 'out',
        'conv2d_1.w_0': 'filter',
        'pool2d_0.tmp_0': 'origin',
        'conv2d_1.tmp_0': 'out'
    },
    elementwise_add: {
        'conv2d_0.tmp_0': 'origin',
        'conv2d_0.b_0': 'counter',
        'conv2d_0.tmp_1': 'out',
        'conv2d_1.tmp_0': 'origin',
        'conv2d_1.b_0': 'counter',
        'conv2d_1.tmp_1': 'out',
        'fc_0.tmp_0': 'origin',
        'fc_0.b_0': 'counter',
        'fc_0.tmp_1': 'out'
    },
    relu: {
        'conv2d_0.tmp_1': 'origin',
        'conv2d_0.tmp_1-1': 'out',
        'conv2d_1.tmp_1': 'origin',
        'conv2d_1.tmp_1-1': 'out'
    },
    pool2d: {
        'conv2d_0.tmp_1-1': 'origin',
        'pool2d_0.tmp_0': 'out',
        'conv2d_1.tmp_1-1': 'origin',
        'pool2d_1.tmp_0': 'out'
    },
    mul: {
        'pool2d_1.tmp_0': 'origin',
        'fc_0.w_0': 'counter',
        'fc_0.tmp_0': 'out'
    },
    softmax: {
        'fc_0.tmp_1': 'origin',
        'fc_0.tmp_2': 'out'
    },
    scale: {
        'fc_0.tmp_2': 'origin',
        'scale_0.tmp_0': 'out'
    }
};
// unique behavior
const opBehavior = {
    conv2d: [
        'needBatch'
    ],
    elementwise_add: [
        'broadcast'
    ],
    pool2d: [
        'isMax',
        'needBatch'
    ],
    relu: [
        'transToPrelu'
    ],
    softmax: [
        'setActiveFunc'
    ],
    mul: [
        'reshape',
        'needBatch'
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
        // 输出tensor
        for (let key in this.output) {
            // 默认取第一个数据
            const data = this.output[key] || [{}];
            tensorData.push(data[0]);
        }
        // unique behavior
        const behavior = opBehavior[this.name] || [];
        behavior.forEach(behavior => {
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
        // 计算属性
        for (let key in this.attrs) {
            if (this.attrs.hasOwnProperty(key)) {
                const item = this.attrs[key];
                if (Object.prototype.toString.call(item) === '[object Array]') {
                    if (keys.indexOf(key) > -1) {
                        this.data[key + '_x'] = item[0];
                        this.data[key + '_y'] = item[1];
                    }
                } else {
                    this.data[key] = item;
                    // 获取shader所需的数据
                    let shaderAttr = shaderAttrs[this.name];
                    if (shaderAttr && shaderAttr.hasOwnProperty(key)) {
                        this.data[shaderAttr[key]] = item;
                    }
                }
            }
        }
        // 获取tensor的数据
        for (let key in this.tensor) {
            const tensor = this.tensor[key];
            tensorAttrs.forEach(attr => {
                this.data[attr+ '_' + tensor.name] = tensor[attr];
            });
        }
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
        let shape = Utils.getBroadcastShapeInPaddle(x.shape, y.shape, this.attrs['axis']);
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

    isMax(tensorData = []) {
        const type = this.attrs['pooling_type'] === 'max' ? 1 : 0;
        this.attrs['pooling_type'] = type;
    }

    transToPrelu(tensorData = []) {
        this.data['multi_value'] = '0.0';
        this.data['active_function'] = 'prelu';
    }

    setActiveFunc(tensorData = []) {
        this.data['multi_value'] = '0.0';
        this.data['active_function'] = 'softmax';

    }

    reshape(tensorData = []) {
        let input = tensorData[0];
        let counter = tensorData[1];
        if (counter.shape.length > input.shape.length) {
            input = tensorData[1];
            counter = tensorData[0];
        }
        if (input.shape.length > 2 && counter.shape.length === 2) {
            let shape = Utils.getReshapeInPaddle(input.shape, counter.shape, tensorData[2].shape);
            input.shape = shape;
        }

    }

    dispose() {
        this.input = null;
        this.output = null;
        this.attrs = null;
        for (let key in this.tensor) {
            this.tensor[key].dispose();
        }
        this.tensor = {};
    }
}
