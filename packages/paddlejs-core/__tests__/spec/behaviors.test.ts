import behaviors from '../../src/opFactory/opBehaviors';
import { OpData, ModelVar } from '../../src/commons/interface';

const conv2d = {
    attrs: {
        paddings: [0, 1]
    }
};

const reshape = {
    name: 'reshape2',
    attrs: {
        new_shape: [-1, 0, 3, 2]
    },
    input: {
        X: [{
            name: 'transpose_3.tmp_0',
            persistable: false,
            shape: [2, 4, 6]
        }]
    },
    output: {
        Out: [{
            name: 'transpose_out.tmp_0',
            persistable: false,
            shape: [2, 4, 3, 2]
        }]
    },
    data: {}
};

const transpose2 = {
    attrs: {
        axis: [3, 0, 1, 2],
        threshold: 6,
        alpha: 0.5
    },
    data: {},
    name: 'transpose2'
};

const pool2d = {
    attrs: {
        global_pooling: true,
        pooling_type: 'max',
        ksize: [1, 1]
    },
    input: {
        X: [{
            name: 'transpose_3.tmp_0',
            persistable: false,
            shape: [2, 4, 3, 2]
        }]
    },
    name: 'pool2d'
};

const mergedOp = {
    subAttrs: [{
        paddings: [0, 0]
    }, {
        alpha: 0.1
    }, {
        axis: 1
    }],
    attrs: {} as any,
    data: {},
    realName: 'conv2d-elementwise_add-leaky_relu',
    name: 'conv2d-elementwise_add'
};

const elementwiseAddOp = {
    input: {
        X: [{
            shape: [3]
        }],
        Y: [{
            shape: [3]
        }]
    },
    attrs: {
        axis: -1
    }
};

const fcOp = {
    tensorData: [
        {
            shape: [3, 2, 3]
        }
    ]
};

const mulOp = {
    tensorData: [
        {
            tensorName: 'origin',
            shape: [1280, 1, 1]
        },
        {
            tensorName: 'counter',
            shape: [1280, 4]
        },
        {
            tensorName: 'output',
            shape: [4]
        }
    ]
};

const mulOp2 = {
    tensorData: [
        {
            tensorName: 'counter',
            shape: [1280, 1, 1]
        },
        {
            tensorName: 'origin',
            shape: [1280, 4]
        },
        {
            tensorName: 'output',
            shape: [4]
        }
    ]
};

const concatOp = {
    attrs: {
        axis: 1
    } as any,
    input: {
        X: [{
            shape: [2, 2, 2]
        }],
        Y: [{
            shape: [2, 1, 2]
        }]
    }
};

const conv2dOp = {
    name: 'conv2d',
    input: {
        Filter: [{
            tensorName: 'filter',
            shape: [1, 1, 32, 32]
        }]
    },
    attrs: {
        groups: 1
    },
    tensorData: [{
        tensorName: 'filter',
        shape: [1, 1, 32, 32]
    }, {
        tensorName: 'out',
        shape: [1, 1, 2, 2]
    }]
};

/* eslint-disable max-lines-per-function */
describe('test op behaviors', () => {
    it('test behavior adaptPaddings', () => {
        behaviors.adaptPaddings.call(conv2d as OpData, []);
        expect(conv2d.attrs.paddings).toEqual([0, 0]);

        conv2d.attrs.paddings = [1, 1];
        behaviors.adaptPaddings.call(conv2d as OpData, []);
        expect(conv2d.attrs.paddings).toEqual([1, 1]);
    });

    it('test behavior inferShape', () => {
        behaviors.inferShape.call(reshape as unknown as OpData, []);
        expect(reshape.output.Out[0].shape).toEqual([2, 4, 3, 2]);

        reshape.attrs.new_shape = [6, 8];
        reshape.input.X[0].shape = [2, 4, 6];
        behaviors.inferShape.call(reshape as unknown as OpData, []);
        expect(reshape.output.Out[0].shape).toEqual([6, 8]);

        // case new_shape === Out[0].shape
        behaviors.inferShape.call(reshape as unknown as OpData, []);
        expect(reshape.output.Out[0].shape).toEqual([6, 8]);
    });

    it('test behavior setPerm', () => {
        behaviors.setPerm.call(transpose2 as unknown as OpData, []);
        expect(transpose2.data['perm_size']).toBe(4);

        const temp: number[] = [];
        for (let i = 0; i < 4; i++) {
            temp[i] = transpose2.data[`perm_${i}`] as number;
        }
        expect(temp).toEqual([1, 2, 3, 0]);

        transpose2.attrs.axis = [2, 0, 1];
        behaviors.setPerm.call(transpose2 as unknown as OpData, []);
        const temp1: number[] = [];
        for (let i = 0; i < 4; i++) {
            temp1[i] = transpose2.data[`perm_${i}`] as number;
        }
        expect(temp1).toEqual([1, 2, 0, 0]);

        transpose2.attrs.axis = [2, 0, 1, 3, 4];
        expect(() => {
            behaviors.setPerm.call(transpose2 as unknown as OpData, []);
        }).toThrow();
    });

    it('test behavior isGlobalPooling', () => {
        behaviors.isGlobalPooling.call(pool2d as unknown as OpData, []);
        expect(pool2d.attrs.ksize).toEqual([3, 2]);
    });

    it('test behavior isMax', () => {
        behaviors.isMax.call(pool2d as unknown as OpData, []);
        expect(pool2d.attrs['pooling_type']).toBe(1);
        expect(pool2d.name).toBe('pool2d_max');
    });


    it('test behavior mergeAttrs', () => {
        behaviors.mergeAttrs.call(mergedOp as unknown as OpData, []);
        expect(mergedOp.attrs.axis).toBe(1);
    });

    it('test behavior transToPrelu', () => {
        behaviors.transToPrelu.call(transpose2 as unknown as OpData, []);
        expect(transpose2.data['multi_value']).toBe('0.0');
        expect(transpose2.data['active_function']).toBe('prelu');
    });

    it('test behavior transToRelu6', () => {
        behaviors.transToRelu6.call(transpose2 as unknown as OpData, []);
        expect(transpose2.data['multi_value']).toBe(6);
        expect(transpose2.data['active_function']).toBe('relu6');
    });

    it('test behavior transToLeakyrelu', () => {
        behaviors.transToLeakyrelu.call(transpose2 as unknown as OpData, []);
        expect(transpose2.data['multi_value']).toBe(0.5);
        expect(transpose2.data['active_function']).toBe('leakyRelu');
        expect(transpose2.name).toBe('relu');
    });

    it('test behavior setActiveFunc', () => {
        behaviors.mergeAttrs.call(mergedOp as unknown as OpData, []);
        behaviors.setActiveFunc.call(mergedOp as unknown as OpData, []);
        expect(mergedOp.data['multi_value']).toBe(0.1);
        expect(mergedOp.data['active_function']).toBe('leakyRelu');
    });

    it('test behavior processAxis', () => {
        behaviors.processAxis.call(elementwiseAddOp as unknown as OpData, []);
        expect(elementwiseAddOp.attrs.axis).toBe(0);

        // axis = 0
        behaviors.processAxis.call(elementwiseAddOp as unknown as OpData, []);
        expect(elementwiseAddOp.attrs.axis).toBe(3);
    });

    it('test behavior flattenShape', () => {
        behaviors.flattenShape.call(fcOp as unknown as OpData, fcOp.tensorData);
        expect(fcOp.tensorData[0].shape).toEqual([2, 9]);
    });

    it('test behavior reshape', () => {
        behaviors.reshape.call(mulOp as unknown as OpData, mulOp.tensorData);
        const origin = mulOp.tensorData.find(item => item.tensorName === 'origin') || {
            shape: [1]
        };
        expect(origin.shape).toEqual([1, 1280]);

        behaviors.reshape.call(mulOp2 as unknown as OpData, mulOp2.tensorData);
        const origin2 = mulOp2.tensorData.find(item => item.tensorName === 'origin') || {
            shape: [1]
        };
        expect(origin2.shape).toEqual([1280, 4]);
    });

    it('test behavior normalizeDim', () => {
        behaviors.normalizeDim.call(concatOp as unknown as OpData, []);
        expect(concatOp.attrs.dim).toBe(1);
    });

    it('test behavior normalizeDim2', () => {
        behaviors.normalizeDim2.call(concatOp as unknown as OpData, []);
        expect(concatOp.attrs.append_num).toBe(1);
    });

    it('test behavior isApplySeparableConv', () => {
        behaviors.isApplySeparableConv.call(conv2dOp as unknown as OpData, conv2dOp.tensorData);
        expect(conv2dOp.name).toBe('conv2d_depthwise');
    });

    it('test behavior processBias', () => {
        behaviors.processBias.call(conv2dOp as unknown as OpData, conv2dOp.tensorData);
        const bias = conv2dOp.tensorData.find(item => item.tensorName === 'bias') as ModelVar;
        expect(bias.shape).toEqual([1]);
        bias.shape = [10];
        expect(bias.shape).toEqual([10]);
    });

    it('test behavior batchComputeConv2d', () => {
        behaviors.batchComputeConv2d.call(conv2dOp as unknown as OpData, conv2dOp.tensorData);
        expect(conv2dOp.attrs['filter_nearest_vec4']).toBe(0);
        expect(conv2dOp.attrs['filter_remainder_vec4']).toBe(1);
    });
});
