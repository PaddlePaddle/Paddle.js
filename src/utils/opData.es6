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
    'offset_x',
    'offset_y',
    'limit',
    'channel',
    'total_shape'
];
// shader中需要的常量
const shaderAttrs = {
    scale: {
        'bias': 'bias_value',
        'scale': 'multi_value'
    },
    pool2d: {
        'pooling_type': 'type_pool'
    },
    pool2d_winograd: {
        'pooling_type': 'type_pool'
    }
};
// model的名字和paddleJS的tensor名字mapping
const tensorName = {
    'input': 'origin',
    'x': 'origin',
    'filter': 'filter',
    'y': 'counter',
    'z': 'appender',
    'output': 'out',
    'out': 'out',
    'scale': 'scale',
    'bias': 'bias',
    'mean': 'mean',
    'variance': 'variance',
    'w': 'weight'
};
// unique behavior
const opBehavior = {
    conv2d: [
        'needBatch',
        'adaptPaddings',
        'isApplySeparableConv',
        'batchComputeConv2d'
    ],
	conv2d_transpose: [
        'needBatch',
        // 'adaptPaddings'
	],
    batchnorm: [
        'needBatch',
        'mergeTensor'
    ],
    elementwise_add: [
		'processAxis',
        'needBatch'
    ],
    conv2d_elementwise_add: [
        'mergeAttrs',
        'setActiveFunc',
        'needBatch'
    ],
    pool2d: [
        'isMax',
        'needBatch',
        'setPacked',
        'isGlobalPooling'
    ],
    relu: [
        'transToPrelu',
        'needBatch'
    ],
    relu6: [
        'transToRelu6',
        'needBatch'
    ],
    leaky_relu: [
        'transToLeakyrelu',
        'needBatch'
    ],
    mul: [
        'reshape',
        'needBatch'
    ],
    bilinear_interp:[
        'needBatch'
    ],
	reshape2: [
		'needBatch',
		'inferShape'
	],
	transpose2: [
		'needBatch',
		'setPerm'
	],
    concat: [
        'normalizeDim',
        'needBatch'
    ],
    concat_mul: [
        'needBatch',
        'processDim',
        'normalizeDim',
        'normalizeDim2',
    ],
    split: [
        'normalizeDim',
        'needBatch'
    ],
    softmax: [
        'needBatch'
    ],
    scale: [
        'needBatch'
    ],
    fc: [
        'flattenShape',
        'needBatch'
    ]
};
const mergeType = 'conv2d-elementwise_add';

export default class OpData {
    constructor(name, input = {}, output = {}, attrs = {}) {
        this.realName = name;
        this.name = name;
        this.attrs = attrs;
        // 检查是否是融合op
        this.checkIsMerge();
        // 是否忽略当前当前op, 使用dropout
        // dropout是指在深度学习网络的训练过程中,对于神经网络单元,按照一定的概率将其暂时从网络中丢弃。
        this.isPass = this.checkIsPass();
        if (this.isPass) {
            this.input = input;
            this.output = output;
            // op数据, 当前不扩展
            this.data = {
                'active_function': 'scale',
                'multi_value': '1.0',
                'bias_value': '0.0',
                'fuse_relu': false
            };

            // tensor数据
            this.inputTensors = [];
            this.outputTensors = [];
            this.fShaderParams = [];
            this.buildTensor();
            this.buildShaderParams();
        }
    }

    adaptPaddings() {
        for (let key in this.attrs) {
            if (this.attrs.hasOwnProperty(key) && key === 'paddings') {
                const item = this.attrs[key];
                const [x, y] = item;
                if (x === 0 && y === 1) {
                    // 兼容paddings为[0, 1]的情况
                    this.attrs[key][1] = 0;
                }
                return;
            }
        }
    }
    inferShape(){
		if (this.name == 'reshape2'){
            let inputShape = this.input.X[0].shape;
            // 把shape变更为new_shape
            if (this.attrs.shape) {
                this.attrs.new_shape = this.attrs.shape;
                delete this.attrs.shape;
            }

			let targetShape = this.attrs.new_shape;
			for (let i = 0; i < targetShape.length; i++){
				if (targetShape[i] == 0) {
					targetShape[i] = inputShape[i];
            	}
        	}
			let total_length = 1;
			for (let j = 0;j < inputShape.length; j++){
				total_length *= inputShape[j];
			}
			let minusPos = -1;
			for (let i = 0; i < targetShape.length; i++){
				if (targetShape[i] == -1) {
					minusPos = i;
					continue;
            	}
            	total_length /= targetShape[i];
        	}
        	if (minusPos != -1) {
				targetShape[minusPos] = total_length;
			}
			this.output.Out[0].shape = targetShape;
		}
	}

    buildTensor() {

        // todo: 是否需要形状对齐
        // todo: 是否需要广播tensor
        const tensorData = [];
        for (let key in this.input) {
            if (this.input.hasOwnProperty(key)) {
                const data = this.input[key] || [{}];
                // 默认取第一个数据
                if (tensorName[key.toLowerCase()]) {
                    data[0].tensorName = tensorName[key.toLowerCase()];
                    tensorData.push(data[0]);
                }
            }
        }
        // debugger
        // todo: 临时删除output里的Y
        delete this.output.Y;
        // 输出tensor
        for (let key in this.output) {
            if (this.output.hasOwnProperty(key)) {
                // 默认取第一个数据
                const data = this.output[key] || [{}];
                if (tensorName[key.toLowerCase()]) {
                    data.forEach(item => {
                        item.tensorName = tensorName[key.toLowerCase()];
                        tensorData.push(item);
                    });
                }
            }
        }
        // unique behavior
        const behavior = opBehavior[this.name] || [];
        behavior.forEach(behavior => {
            this[behavior](tensorData);
        });

        // 生成tensor对象
        tensorData.forEach(data => {
            if (data) {
                let tensor = null;
                const tensorName = data.tensorName;
                if (data.notTensor) {
                    tensor = {
                        name: tensorName,
                        data: new Float32Array(data.data),
                        total_shape: data.data.length
                    };
                } else {
                    tensor = new Tensor({
                        type: data.name,
                        name: tensorName,
                        shape: data.shape,
                        data: data.data,
                        needBatch: data.needBatch || false,
                        notCompressed: data.notCompressed || false,
                        isPacked: data.isPacked || false
                    });
                }

                if (tensorName === 'out') {
                    this.outputTensors.push(tensor);
                }
                else {
                    this.inputTensors.push(tensor);
                }
            }
        });
    }

    buildShaderParams() {
        // 计算属性
        for (let key in this.attrs) {
            if (this.attrs.hasOwnProperty(key)) {
                const item = this.attrs[key];
                if (Object.prototype.toString.call(item) === '[object Array]' && keys.indexOf(key) > -1) {
                    this.data[key + '_x'] = item[0];
                    this.data[key + '_y'] = item[1];
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
        // 遍历 获取input tensor的数据
        this.inputTensors.forEach(inputTensor => {
            tensorAttrs.forEach(attr => {
                this.data[attr+ '_' + inputTensor.name] = inputTensor[attr];
            });
        });

        // 根据out tensor 个数 生成对应的 fShader 个数
        this.outputTensors.forEach(outTensor => {
            const params = JSON.parse(JSON.stringify(this.data));
            // 获取output tensor的数据

            tensorAttrs.forEach(attr => {
                params[attr+ '_' + outTensor.name] = outTensor[attr];
            });
            this.fShaderParams.push(params);
        });

    }

    needBatch(tensorData = []) {
        tensorData.forEach(data => (data.needBatch = true));
    }

	setPerm(tensorData = []){
		let arrayPerm = this.attrs['axis'];
		let l = arrayPerm.length;
		if (l == 3) {
			if (arrayPerm == [2,0,1]) {
				arrayPerm = [1,2,0];
		}
			else if (arrayPerm == [1,2,0]){
				arrayPerm = [2,0,1];
		}
		}
		else if (l == 4){
			let temp = [0,0,0,0];
			for (let i = 0; i < 4; i++){
				temp[[arrayPerm[i]]] = i;
			}
			arrayPerm = temp;
		}
		this.data['perm_0'] = 0;
		this.data['perm_1'] = 0;
		this.data['perm_2'] = 0;
		this.data['perm_3'] = 0;
		if (l >= 1) {
			this.data['perm_0'] = arrayPerm[0];
		}
		if (l >= 2) {
			this.data['perm_1'] = arrayPerm[1];
		}
		if (l >= 3) {
			this.data['perm_2'] = arrayPerm[2];
		}
		if (l >= 4) {
			this.data['perm_3'] = arrayPerm[3];
		}
		this.data['perm_size'] = l;
	}

    isGlobalPooling(tensorData = []) {
        let counter = tensorData.filter(tensor => (tensor.tensorName === 'origin'))[0] || {};
        let length = counter.shape && counter.shape.length || 0;
        if (length > 2 && this.attrs['global_pooling']) {
            this.attrs.ksize = [counter.shape[length - 2], counter.shape[length - 1]];
        }
    }

    mergeAttrs() {
        this.attrs = this.attrs.reduce((attrs, item) => {
            return Object.assign(attrs, item);
        }, {});
    }


    isApplyWinoGrad(tensorData = []) {
        const filter = tensorData.filter(item => {
            const [b, c, h, w] = item.shape;
            return (h === 3) && (w === 3) && (item.tensorName === 'filter');
        });
        // 使用winograd算法
        if (filter && filter.length) {
            this.setPacked(tensorData);
            this.applyWinograd(tensorData);
            this.setOutputPacked(tensorData);
            this.name += '_winograd';
        }
    }

    isApplySeparableConv(tensorData = []) {
        const groups = this.attrs.groups;
        let hasBias = false;
        let outC;
        const filter = tensorData.filter(item => {
            const {shape, tensorName} = item;
            if (tensorName === 'bias') {
                hasBias = true;
            }
            const [b, c, h, w] = shape;
            if (!hasBias && !outC && tensorName === 'out') {
                outC = c;
            }

            return (b === groups) && (c === 1) && (item.tensorName === 'filter');
        });
        if (filter && filter.length) {
            // 可以执行separable conv
            this.name += '_depthwise';
        }

        !hasBias && tensorData.push({
            name: "conv1_scale_offset",
            needBatch: true,
            persistable: true,
            shape: [outC],
            data: Array.from(new Float32Array(outC), i => 0),
            tensorName: "bias"
        });
    }

    batchComputeConv2d() {
        let origin_shape_temp = this.input.Filter[0].shape;
        let inChannels = origin_shape_temp[1];
        this.attrs.filter_nearest_vec4 = Math.floor(inChannels / 4) * 4;
        this.attrs.filter_remainder_vec4 = inChannels % 4;
    }

    setPacked(tensorData = []) {
        const isPacked = this.attrs.ispacked;
        tensorData.forEach(item => {
            if (item.tensorName === 'origin' && isPacked) {
                item.isPacked = true;
                if (this.name.indexOf('pool') > -1) {
                    this.name += '_winograd';
                }
            }
        });
    }

    applyWinograd(tensorData = []) {
        tensorData.forEach(item => {
            if (item.tensorName === 'filter') {
                const [b, c, h, w] = item.shape;
                item.shape = [b, c, 4, 4];
                item.data = Utils.applyFilterWinograd(item.data, item.shape);
            }
        });
    }

    setOutputPacked(tensorData = []) {
        tensorData.forEach(item => {
            if (item.tensorName === 'out') {
                item.isPacked = true;
            }
        });
    }

    isMax(tensorData = []) {
        const type = this.attrs['pooling_type'] === 'max' ? 1 : 0;
        this.attrs['pooling_type'] = type;
        if (type === 1) {
            this.name += '_max';
        }
    }

    transToPrelu(tensorData = []) {
        this.data['multi_value'] = '0.0';
        this.data['active_function'] = 'prelu';
    }

    transToRelu6(tensorData = []) {
        this.data['multi_value'] = this.attrs['threshold'];
        this.data['active_function'] = 'relu6';
    }

    transToLeakyrelu(tensorData = []) {
        this.data['multi_value'] = this.attrs.alpha;
        this.data['active_function'] = 'leakyRelu';
        this.name = 'relu';
    }

    setActiveFunc() {
        // 用于融合op
        const suffix = this.realName.replace(mergeType + '-', '');
        if (suffix === 'leaky_relu') {
            this.data['multi_value'] = this.attrs.alpha;
            this.data['active_function'] = 'leakyRelu';
        }
    }

    normalizeDim() {
        let origin_shape_temp = this.input.X[0].shape;
        if (origin_shape_temp.length < 4) {
            let batch = [];
            for (let i = 0; i < (4 - origin_shape_temp.length); i++) {
                batch.push(1);
            }
            origin_shape_temp = batch.concat(origin_shape_temp);
        }
        const origin_shape = origin_shape_temp;
        const axis = this.attrs.axis > -1 ? this.attrs.axis : origin_shape.length + this.attrs.axis;
        const dim_value = [];
        for (let index = 0; index < origin_shape[axis]; index++) {
            dim_value[index] = index;
        }
        this.attrs.target_length = dim_value.length;
        this.attrs.target_value = dim_value;
        // 保存 输入 tensor 对应dim 的长度
        this.attrs.inputs_dim = origin_shape[axis];
        this.attrs.dim = 4 - origin_shape.length + axis;
    }
    normalizeDim2() {
        let origin_shape_temp = this.input.Y[0].shape;
        if (origin_shape_temp.length < 4) {
            let batch = [];
            for (let i = 0; i < (4 - origin_shape_temp.length); i++) {
                batch.push(1);
            }
            origin_shape_temp = batch.concat(origin_shape_temp);
        }
        const origin_shape = origin_shape_temp;
        const axis = this.attrs.axis > -1 ? this.attrs.axis : origin_shape.length + this.attrs.axis;

        // 保存 输入 tensor 对应dim 的长度
        this.attrs.append_num = origin_shape[axis];
    }

    processDim() {
        const axis = this.attrs.axis;
        if (axis !== -1) {
            let shape = this.input.X[0].shape;
            this.attrs.axis += 4 - shape.length;
        }
    }

    processAxis() {
		let shape_x = this.input.X[0].shape;
        let shape_y = this.input.Y[0].shape;
        let axis_temp = this.attrs['axis'];
        if (axis_temp == -1) {
            this.attrs['axis'] = shape_x.length - shape_y.length;
        }
        else {
            this.attrs['axis'] = 4 - shape_y.length - axis_temp;
        }
	}

    flattenShape(tensorData = []) {
        const target = tensorData.find(item => item.shape.length > 2);
        if (target) {
            const padShape = Utils.padToFourDimShape(target.shape);
            target.shape = [padShape[0] * padShape[2], padShape[1] * padShape[3]];
        }

    }

    reshape(tensorData = []) {
        const input = tensorData.find(item => item.tensorName === 'origin');
        const counter = tensorData.find(item => item.tensorName === 'counter');
        const out = tensorData.find(item => item.tensorName === 'out' || item.tensorName === 'output');

        if (counter.shape.length > input.shape.length) {
            input = counter;
            counter = input;
        }
        if (input.shape.length > 2 && counter.shape.length === 2) {
            let shape = Utils.getReshapeInPaddle(input.shape, counter.shape, out.shape);
            input.shape = shape;
        }

    }

    mergeTensor(tensorData = []) {
        // 融合scale、bias、variance、mean

        let constants = ['scale', 'bias', 'variance', 'mean'];
        let result = {};
        let data = [];
        tensorData.forEach((tensor, index) => {
            result[tensor.tensorName] = tensor;
            result[tensor.tensorName + 'Index'] = index;
        });

     //   for (let i = 0; i < result[constants[0]].shape[0]; i++) {
      //      data.push(result[constants[0]].data[i]);
      //      data.push(result[constants[1]].data[i]);
     //       data.push(result[constants[2]].data[i]);
      //      data.push(result[constants[3]].data[i]);
      //  }

        // tensorData[result[constants[0] + 'Index']].data = data;
        for (let i = 0; i < constants.length; i++){
            tensorData[result[constants[i] + 'Index']].data = result[constants[i]].data;
        }
        // 充分利用shader空间
        //tensorData[result[constants[0] + 'Index']].notCompressed = true;
       // tensorData[result[constants[0] + 'Index']].shape[0] *= 4;
        //tensorData.splice(result[constants[1] + 'Index'], 1, 0);
        //tensorData.splice(result[constants[2] + 'Index'], 1, 0);
        //tensorData.splice(result[constants[3] + 'Index'], 1, 0);
    }

    checkIsMerge() {
        if (this.name.indexOf(mergeType) > -1
            && Object.prototype.toString.apply(this.attrs) === '[object Array]') {
            // 第一个融合op
            this.name  = 'conv2d_elementwise_add';
            return true;
        }
        return false;
    }

    checkIsPass() {
        if (this.name === 'dropout') {
            if (this.attrs['dropout_implementation'] === 'downgrade_in_infer') {
                this.name = 'scale';
                this.attrs['scale'] = this.attrs['dropout_prob'];
                this.attrs['bias'] = 0.0;
                return true;
            }
            return false;
        }
        if (this.name === 'depthwise_conv2d') {
            this.name = 'conv2d';
        }
        return true;
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
