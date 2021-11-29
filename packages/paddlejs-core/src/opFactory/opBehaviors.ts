import { OpData } from '../commons/interface';
import * as Utils from './utils';

interface Behaviors {
    [key: string]: (this: OpData, tensorData: any[]) => any;
}

const behaviors : Behaviors = {
    adaptPaddings() {
        for (const key in this.attrs) {
            if (Object.prototype.hasOwnProperty.call(this.attrs, key) && key === 'paddings') {
                const item = this.attrs[key];
                const [x, y] = item;
                if (x === 0 && y === 1) {
                    // 兼容paddings为[0, 1]的情况
                    this.attrs[key][1] = 0;
                }
                return;
            }
        }
    },

    setAdaptive() {
        if (
            this.attrs.adaptive
            && this.attrs.ksize.length === 2
            && this.attrs.ksize[0] === 1
            && this.attrs.ksize[1] === 1
        ) {
            this.attrs.adaptive = false;
            this.attrs.global_pooling = true;
        }
    },

    isGlobalPooling() {
        const counter = this.input.X[0] || {};
        const length = (counter.shape && counter.shape.length) || 0;
        if (length > 2 && this.attrs['global_pooling']) {
            this.attrs.ksize = [counter.shape[length - 2], counter.shape[length - 1]];
        }
    },

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
    },

    mergeAttrs() {
        this.attrs = this.subAttrs.reduce((attrs, item) => {
            return Object.assign(attrs, item);
        }, {});
    },

    isApplySeparableConv(tensorData = []) {
        if (this.isPackedOp) {
            return;
        }
        const groups = this.attrs.groups;
        const filter = tensorData.filter(item => {
            const { shape, tensorName } = item;
            const [b, c] = shape;
            return (b === groups) && (c === 1) && (tensorName === 'filter');
        });

        if (this.name === 'depthwise_conv2d') {
            this.name = 'conv2d';
        }
        if (filter && filter.length) {
            // 可以执行separable conv
            this.name += '_depthwise';
        }
    },

    batchComputeConv2d() {
        try {
            const originShapeTemp = this.input.Filter[0].shape;
            const inChannels = originShapeTemp[1];
            this.attrs.filter_nearest_vec4 = Math.floor(inChannels / 4) * 4;
            this.attrs.filter_remainder_vec4 = inChannels % 4;
        }
        catch (e) {
            console.error(e);
        }
    },

    processBias(tensorData = []) {
        const bias = tensorData.find(item => item.tensorName === 'bias');
        if (bias && this.isPackedOp) {
            bias.packed = true;
            const shape = bias.shape;
            const newShape = [shape[shape.length - 1] / 4, 1, 1];
            bias.shape = newShape;
        }
    },

    isMax() {
        const type = this.attrs['pooling_type'] === 'max' ? 1 : 0;
        this.attrs['pooling_type'] = type;
        if (type === 1) {
            this.name += '_max';
        }
    },

    transToPrelu() {
        this.data['multi_value'] = '0.0';
        this.data['active_function'] = 'prelu';
    },

    transToRelu6() {
        this.data['multi_value'] = this.attrs['threshold'];
        this.data['active_function'] = 'relu6';
    },

    transToHardSigmoid() {
        this.data['multi_value'] = this.attrs['slope'] || 0.2;
        this.data['bias_value'] = this.attrs['offset'] || 0.5;
        this.data['active_function'] = 'hardSigmoid';
    },

    transToLeakyrelu() {
        this.data['multi_value'] = this.attrs.alpha;
        this.data['active_function'] = 'leakyRelu';
        this.name = 'relu';
    },

    transToPow() {
        this.data['multi_value'] = this.attrs.factor || 2;
        this.data['active_function'] = 'pow_func';
        this.name = 'pow';
    },

    transToSigmoid() {
        this.data['active_function'] = 'sigmoid';
    },

    transToSqrt() {
        this.data['active_function'] = 'sqrt';
    },

    transToTanh() {
        this.data['active_function'] = 'tanh_func';
    },

    transToScale() {
        const scale = this.attrs['scale'];
        this.data['multi_value'] = scale !== undefined ? scale : 1;
        this.data['bias_value'] = this.attrs['bias'] || 0;
        const bias_after_scale = this.attrs['bias_after_scale'];
        this.data['active_function'] = (bias_after_scale || bias_after_scale === undefined)
            ? 'scale'
            : 'scaleWidthBias';
    },

    setActiveFunc() {
        // 用于融合op
        const mergeType = 'conv2d-elementwise_add';
        const suffix = this.realName.replace(mergeType + '-', '');

        this.data = Object.assign({
            active_function: 'scale',
            multi_value: '1.0',
            bias_value: '0.0',
            fuse_relu: false
        }, this.data);

        if (suffix === 'leaky_relu') {
            this.data['multi_value'] = this.attrs.alpha;
            this.data['active_function'] = 'leakyRelu';
        }
    },

    normalizePerm(tensorData = []) {
        const input = tensorData.find(item => item.tensorName === 'origin');
        const length_unformatted_shape = input.shape.length;
        const axis = this.attrs.axis;
        let arrayPerm : number[] = axis;
        let length = arrayPerm.length;

        const diffLength = length - length_unformatted_shape;
        if (diffLength > 0) {
            arrayPerm = arrayPerm
                .map(item => item - 1)
                .filter(item => item >= 0);
            length = arrayPerm.length;
        }
        if (length > 4) {
            throw Error(`op transpoes2 axis length exceeds maximum length 4, get ${length}`);
        }
        const temp = new Array(length).fill(0);
        for (let i = 0; i < length; i++) {
            const index = arrayPerm[i];
            temp[index] = i;
        }
        const perm_arr = [];
        for (let i = 0; i < 4; i++) {
            perm_arr[i] = temp[i] || 0;
        }

        this.attrs.perm_arr = perm_arr;
        this.attrs.perm_size = length;
    },

    normalizeDim() {
        const originShape = this.input.X[0].shape;
        const shape = Utils.formatShape(originShape);
        const axis = Utils.formatAxis(originShape, this.attrs.axis);
        const dim_value: number[] = [];
        for (let index = 0; index < shape[axis]; index++) {
            dim_value[index] = index;
        }
        this.attrs.target_length = dim_value.length;
        this.attrs.target_value = dim_value;
        // 保存 输入 tensor 对应dim 的长度
        this.attrs.inputs_dim = shape[axis];
        this.attrs.dim = axis;
        this.attrs.fourInputs = false;

        if (this.input.Y) {
            const yShape = Utils.formatShape(this.input.Y[0].shape);
            this.attrs.counter_num = yShape[axis];
        }

        if (this.input.Z) {
            const zShape = Utils.formatShape(this.input.Z[0].shape);
            this.attrs.append_num = zShape[axis];
        }

        if (this.input.M) {
            this.attrs.fourInputs = true;
            const mShape = Utils.formatShape(this.input.M[0].shape);
            this.attrs.fourth_num = mShape[axis];
        }
    },

    processAxis() {
        const shape_x = this.input.X[0].shape;
        const shape_y = this.input.Y[0].shape;
        let axis = this.attrs.axis || -1;

        this.attrs.counterLen = shape_y.length;
        // shape x === shape y
        if (Utils.accShape(shape_x) === Utils.accShape(shape_y)) {
            this.attrs.axis = 0;
            this.attrs.counterLen = 4;
        }
        else {
            if (axis === -1) {
                axis = shape_x.length - shape_y.length;
            }
            this.attrs.axis = Utils.formatAxis(shape_x, axis);
        }
    },

    genElementwiseCounterPos() {
        const { counterLen, axis } = this.attrs;
        const shape = ['0', '0', '0', '0'];
        let posIndex = axis;
        for (let i = 4 - counterLen; i < 4; i++) {
            shape[i] = `oPos[${posIndex++}]`;
        }

        this.attrs.counterPos = shape.join(',');
    },

    flattenShape(tensorData = []) {
        const target = tensorData.find(item => item.shape.length > 2);
        if (target) {
            const padShape = Utils.formatShape(target.shape);
            target.shape = [padShape[0] * padShape[2], padShape[1] * padShape[3]];
        }

    },

    reshape(tensorData = []) {
        let input = tensorData.find(item => item.tensorName === 'origin');
        let counter = tensorData.find(item => item.tensorName === 'counter');
        const out = tensorData.find(item => item.tensorName === 'out' || item.tensorName === 'output');

        if (counter.shape.length > input.shape.length) {
            const temp = counter;
            counter = input;
            input = temp;
        }

        if (input.shape.length > 2 && counter.shape.length === 2) {
            const shape = Utils.getReshapeInPaddle(input.shape, out.shape);
            input.shape = shape;
        }
    },

    checkIsMerge() {
        const mergeType = 'conv2d-elementwise_add';
        const suffix = this.realName.replace(mergeType + '-', '');
        this.name = 'conv2d_elementwise_add';
        if (suffix === 'leaky_relu') {
            this.attrs.alpha && (this.data['multi_value'] = this.attrs.alpha);
            this.data['active_function'] = 'leakyRelu';
        }
    }
};


export default behaviors;
