import behaviors from '../../src/opFactory/opBehaviors';
import { OpData } from '../../src/commons/interface';

const conv2d = {
    processedAttrs: {
        paddings: [0, 1]
    }
};

const transpose2 = {
    processedAttrs: {
        axis: [3, 0, 1, 2],
        threshold: 6,
        alpha: 0.5
    },
    name: 'transpose2'
};

const pool2d = {
    processedAttrs: {
        global_pooling: true,
        pooling_type: 'max',
        ksize: [1, 1]
    },
    name: 'pool2d',
    tensorDataMap: {
        origin: {
            name: 'transpose_3.tmp_0',
            persistable: false,
            shape: [2, 4, 3, 2]
        }
    }
};

const mergedOp = {
    subAttrs: [{
        paddings: [0, 0]
    }, {
        alpha: 0.1
    }, {
        axis: 1
    }],
    processedAttrs: {} as any,
    name: 'conv2d-elementwise_add-leaky_relu'
};

const elementwiseAddOp = {
    processedAttrs: {
        axis: -1
    },
    tensorDataMap: {
        origin: {
            tensorName: 'origin',
            shape: [3]
        },
        counter: {
            tensorName: 'counter',
            shape: [3]
        }
    }
};

const fcOp = {
    tensorDataMap: {
        origin: {
            tensorName: 'origin',
            shape: [3, 2, 3]
        }
    }
};

const mulOp = {
    tensorDataMap: {
        origin: {
            tensorName: 'origin',
            shape: [1280, 1, 1]
        },
        counter: {
            tensorName: 'counter',
            shape: [1280, 4]
        },
        out: {
            tensorName: 'out',
            shape: [4]
        }
    }
};

const mulOp2 = {
    tensorDataMap: {
        counter: {
            tensorName: 'counter',
            shape: [1280, 1, 1]
        },
        origin: {
            tensorName: 'origin',
            shape: [1280, 4]
        },
        out: {
            tensorName: 'out',
            shape: [4]
        }
    }
};

const concatOp = {
    processedAttrs: {
        axis: 2
    } as any,
    tensorDataMap: {
        origin: {
            tensorName: 'origin',
            shape: [1, 2, 2, 2]
        },
        counter: {
            tensorName: 'out',
            shape: [1, 2, 1, 2]
        }
    }
};

const conv2dOp = {
    name: 'conv2d',
    processedAttrs: {
        groups: 1
    },
    tensorDataMap: {
        filter: {
            tensorName: 'filter',
            shape: [1, 1, 32, 32]
        },
        out: {
            tensorName: 'out',
            shape: [1, 1, 2, 2]
        }
    }
};

/* eslint-disable max-lines-per-function */
describe('test op behaviors', () => {
    it('test behavior adaptPaddings', () => {
        behaviors.adaptPaddings.call(conv2d as unknown as OpData);
        expect(conv2d.processedAttrs.paddings).toEqual([0, 0]);

        conv2d.processedAttrs.paddings = [1, 1];
        behaviors.adaptPaddings.call(conv2d as unknown as OpData);
        expect(conv2d.processedAttrs.paddings).toEqual([1, 1]);
    });

    it('test behavior isGlobalPooling', () => {
        behaviors.isGlobalPooling.call(pool2d as unknown as OpData);
        expect(pool2d.processedAttrs.ksize).toEqual([3, 2]);
    });

    it('test behavior isMax', () => {
        behaviors.isMax.call(pool2d as unknown as OpData);
        expect(pool2d.processedAttrs['pooling_type']).toBe(1);
        expect(pool2d.name).toBe('pool2d_max');
    });


    it('test behavior mergeAttrs', () => {
        behaviors.mergeAttrs.call(mergedOp as unknown as OpData);
        expect(mergedOp.processedAttrs.axis).toBe(1);
    });

    it('test behavior transToPrelu', () => {
        behaviors.transToPrelu.call(transpose2 as unknown as OpData);
        expect(transpose2.processedAttrs['multi_value']).toBe('0.0');
        expect(transpose2.processedAttrs['active_function']).toBe('prelu');
    });

    it('test behavior transToRelu6', () => {
        behaviors.transToRelu6.call(transpose2 as unknown as OpData);
        expect(transpose2.processedAttrs['multi_value']).toBe(6);
        expect(transpose2.processedAttrs['active_function']).toBe('relu6');
    });

    it('test behavior transToLeakyrelu', () => {
        behaviors.transToLeakyrelu.call(transpose2 as unknown as OpData);
        expect(transpose2.processedAttrs['multi_value']).toBe(0.5);
        expect(transpose2.processedAttrs['active_function']).toBe('leakyRelu');
        expect(transpose2.name).toBe('relu');
    });

    it('test behavior setActiveFunc', () => {
        behaviors.mergeAttrs.call(mergedOp as unknown as OpData);
        behaviors.setActiveFunc.call(mergedOp as unknown as OpData);
        expect(mergedOp.processedAttrs['multi_value']).toBe(0.1);
        expect(mergedOp.processedAttrs['active_function']).toBe('leakyRelu');
    });

    it('test behavior processAxis', () => {
        behaviors.processAxis.call(elementwiseAddOp as unknown as OpData);
        expect(elementwiseAddOp.processedAttrs.axis).toBe(0);
    });

    it('test behavior flattenShape', () => {
        console.log(JSON.stringify(fcOp));
        behaviors.flattenShape.call(fcOp as unknown as OpData);
        const origin = fcOp.tensorDataMap['origin'];
        expect(origin.shape).toEqual([2, 9]);
    });

    it('test behavior reshape', () => {
        behaviors.reshape.call(mulOp as unknown as OpData);
        const origin = mulOp.tensorDataMap['origin'];
        expect(origin.shape).toEqual([1, 1280]);

        behaviors.reshape.call(mulOp2 as unknown as OpData);
        const origin2 = mulOp2.tensorDataMap['origin'];
        expect(origin2.shape).toEqual([1280, 4]);
    });

    it('test behavior normalizeDim', () => {
        behaviors.normalizeDim.call(concatOp as unknown as OpData);
        expect(concatOp.processedAttrs.dim).toBe(2);
    });

    it('test behavior isApplySeparableConv', () => {
        behaviors.isApplySeparableConv.call(conv2dOp as unknown as OpData);
        expect(conv2dOp.name).toBe('conv2d_depthwise');
    });

    it('test behavior batchComputeConv2d', () => {
        behaviors.batchComputeConv2d.call(conv2dOp as unknown as OpData);
        expect(conv2dOp.processedAttrs['filter_nearest_vec4']).toBe(0);
        expect(conv2dOp.processedAttrs['filter_remainder_vec4']).toBe(1);
    });
});
