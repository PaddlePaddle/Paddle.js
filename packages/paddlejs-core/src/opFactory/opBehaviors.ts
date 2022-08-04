import env from '../env';
import { OpData } from '../commons/interface';
import * as Utils from './utils';

interface Behaviors {
    [key: string]: (this: OpData) => void;
}

const behaviors : Behaviors = {
    adaptPaddings() {
        for (const key in this.processedAttrs) {
            if (Object.prototype.hasOwnProperty.call(this.processedAttrs, key) && key === 'paddings') {
                const item = this.processedAttrs[key];
                const [x, y] = item;
                if (x === 0 && y === 1) {
                    // 兼容paddings为[0, 1]的情况
                    this.processedAttrs[key][1] = 0;
                }
                return;
            }
        }
    },

    setAdaptive() {
        if (
            this.processedAttrs.adaptive
            && this.processedAttrs.ksize.length === 2
            && this.processedAttrs.ksize[0] === 1
            && this.processedAttrs.ksize[1] === 1
        ) {
            this.processedAttrs.adaptive = false;
            this.processedAttrs.global_pooling = true;
        }
    },

    isGlobalPooling() {
        const origin = this.tensorDataMap['origin'];
        const length = origin?.shape?.length || 0;
        if (length > 2 && this.processedAttrs['global_pooling']) {
            this.processedAttrs.ksize = [origin.shape[length - 2], origin.shape[length - 1]];
        }
    },

    setPacked() {
        const isPacked = this.processedAttrs.ispacked;
        const origin = this.tensorDataMap['origin'];
        if (origin && isPacked) {
            if (this.name.indexOf('pool') > -1) {
                this.name += '_winograd';
            }
        }
    },

    mergeAttrs() {
        this.processedAttrs = this.subAttrs.reduce((attrs, item) => {
            return Object.assign(attrs, item);
        }, {});
    },

    isApplySeparableConv() {
        if (this.isPackedOp) {
            return;
        }
        const groups = this.processedAttrs.groups;
        const filter = this.tensorDataMap['filter'];

        if (this.name === 'depthwise_conv2d') {
            this.name = 'conv2d';
        }
        if (filter) {
            const [b, c] = filter.shape;
            // 可以执行separable conv
            (b === groups) && (c === 1) && (this.name += '_depthwise');
        }
    },

    batchComputeConv2d() {
        const filter = this.tensorDataMap['filter'];
        const originShapeTemp = filter.shape;
        const inChannels = originShapeTemp[1];
        this.processedAttrs.filter_nearest_vec4 = Math.floor(inChannels / 4) * 4;
        this.processedAttrs.filter_remainder_vec4 = inChannels % 4;
    },

    processBias() {
        const bias = this.tensorDataMap['bias'];
        if (bias && this.isPackedOp) {
            bias.packed = true;
            const shape = bias.shape;
            const newShape = [shape[shape.length - 1] / 4, 1, 1];
            bias.shape = newShape;
        }
    },

    isAdaptiveAvg() {
        const {
            adaptive,
            pooling_type
        } = this.processedAttrs;

        if (adaptive && pooling_type === 'avg') {
            this.name += '_avg_adaptive';
        }
    },

    isMax() {
        const type = this.processedAttrs['pooling_type'] === 'max' ? 1 : 0;
        this.processedAttrs['pooling_type'] = type;
        if (type === 1) {
            this.name += '_max';
        }
    },

    transToPrelu() {
        this.processedAttrs['multi_value'] = '0.0';
        this.processedAttrs['active_function'] = 'prelu';
    },

    transToRelu6() {
        this.processedAttrs['multi_value'] = this.processedAttrs['threshold'];
        this.processedAttrs['active_function'] = 'relu6';
    },

    transToHardSigmoid() {
        this.processedAttrs['multi_value'] = this.processedAttrs['slope'] || 0.2;
        this.processedAttrs['bias_value'] = this.processedAttrs['offset'] || 0.5;
        this.processedAttrs['active_function'] = 'hardSigmoid';
    },

    transToLeakyrelu() {
        this.processedAttrs['multi_value'] = this.processedAttrs.alpha;
        this.processedAttrs['active_function'] = 'leakyRelu';
        this.name = 'relu';
    },

    transToPow() {
        this.processedAttrs['multi_value'] = this.processedAttrs.factor || 2;
        this.processedAttrs['active_function'] = 'pow_func';
        this.name = 'pow';
    },

    transToSigmoid() {
        this.processedAttrs['active_function'] = 'sigmoid';
    },

    transToSqrt() {
        this.processedAttrs['active_function'] = 'sqrt';
    },

    transToTanh() {
        this.processedAttrs['active_function'] = 'tanh_func';
    },

    transToAbs() {
        this.processedAttrs['active_function'] = 'abs_func';
    },

    transToExp() {
        this.processedAttrs['active_function'] = 'exp';
    },

    transToScale() {
        const scale = this.processedAttrs['scale'];
        this.processedAttrs['multi_value'] = scale !== undefined ? scale : 1;
        this.processedAttrs['bias_value'] = this.processedAttrs['bias'] || 0;
        const bias_after_scale = this.processedAttrs['bias_after_scale'];
        this.processedAttrs['active_function'] = (bias_after_scale || bias_after_scale === undefined)
            ? 'scale'
            : 'scaleWidthBias';
    },

    setActiveFunc() {
        // 用于融合op
        const mergeType = 'conv2d-elementwise_add';
        const suffix = this.name.replace(mergeType + '-', '');

        this.processedAttrs = Object.assign({
            active_function: 'scale',
            multi_value: '1.0',
            bias_value: '0.0',
            fuse_relu: false
        }, this.processedAttrs);

        if (suffix === 'leaky_relu') {
            this.processedAttrs['multi_value'] = this.processedAttrs.alpha;
            this.processedAttrs['active_function'] = 'leakyRelu';
        }
    },

    normalizePerm() {
        const origin = this.tensorDataMap['origin'];
        const length_unformatted_shape = origin.shape.length;
        const axis = this.processedAttrs.axis;
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

        this.processedAttrs.perm_arr = perm_arr;
        this.processedAttrs.perm_size = length;
    },

    normalizeDim() {
        const originShape = this.tensorDataMap['origin'].shape;
        const shape = Utils.formatShape(originShape);
        const { axis: attrAxis, dim: attrDim } = this.processedAttrs;
        const originAxis = attrAxis !== undefined
            ? attrAxis
            : (Array.isArray(attrDim) && attrDim.length ? attrDim[0] : attrDim);
        const axis = Utils.formatAxis(originShape, originAxis);
        const dim_value: number[] = [];
        for (let index = 0; index < shape[axis]; index++) {
            dim_value[index] = index;
        }
        this.processedAttrs.target_length = dim_value.length;
        this.processedAttrs.target_value = dim_value;
        // 保存 输入 tensor 对应dim 的长度
        this.processedAttrs.inputs_dim = shape[axis];
        this.processedAttrs.dim = axis;
        if (this.processedAttrs.num === 0) {
            this.processedAttrs.num = Object.values(this.tensorDataMap)
                .filter(item => item.tensorName === 'out').length || 1;
        }

        // wasm backend is not support any number of inputs, retain temporarily
        if (env.get('backend') === 'wasm') {
            this.processedAttrs.fourInputs = false;

            const counter = this.tensorDataMap['counter'];
            if (counter) {
                const yShape = Utils.formatShape(counter.shape);
                this.processedAttrs.counter_num = yShape[axis];
            }
            const appender = this.tensorDataMap['appender'];
            if (appender) {
                const zShape = Utils.formatShape(appender.shape);
                this.processedAttrs.append_num = zShape[axis];
            }

            const fourth = this.tensorDataMap['fourth'];
            if (fourth) {
                this.processedAttrs.fourInputs = true;
                const mShape = Utils.formatShape(fourth.shape);
                this.processedAttrs.fourth_num = mShape[axis];
            }
        }
    },

    processElementwiseAxis() {
        const shape_x = this.tensorDataMap['origin'].shape;
        const shape_y = this.tensorDataMap['counter'].shape;
        let axis = this.processedAttrs.axis === undefined ? -1 : this.processedAttrs.axis;

        this.processedAttrs.counterLen = shape_y.length;
        // shape x === shape y
        if (Utils.getSumOfShape(shape_x) === Utils.getSumOfShape(shape_y)) {
            this.processedAttrs.axis = 0;
            this.processedAttrs.counterLen = 4;
        }
        else {
            if (axis === -1) {
                axis = shape_x.length - shape_y.length;
            }
            this.processedAttrs.axis = Utils.formatAxis(shape_x, axis);
        }
    },

    genElementwiseCounterPos() {
        const { counterLen, axis } = this.processedAttrs;
        const shape = ['0', '0', '0', '0'];
        let posIndex = axis;
        for (let i = 4 - counterLen; i < 4; i++) {
            shape[i] = `oPos[${posIndex++}]`;
        }

        this.processedAttrs.counterPos = shape.join(',');
    },

    flattenShape() {
        const target = Object.values(this.tensorDataMap).find(item => item.shape.length > 2);
        if (target) {
            const padShape = Utils.formatShape(target.shape);
            target.shape = [padShape[0] * padShape[2], padShape[1] * padShape[3]];
        }
    },

    reshape() {
        let input = this.tensorDataMap['origin'];
        let counter = this.tensorDataMap['counter'];
        const out = this.tensorDataMap['out'];

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
        const suffix = this.name.replace(mergeType + '-', '');
        this.name = 'conv2d_elementwise_add';
        if (suffix === 'leaky_relu') {
            this.processedAttrs.alpha && (this.processedAttrs['multi_value'] = this.processedAttrs.alpha);
            this.processedAttrs['active_function'] = 'leakyRelu';
        }
    }
};


export default behaviors;
