
import Transformer from './transformer';
import { ModelOp } from '../commons/interface';

export default class FormateInstanceNorm extends Transformer {
    constructor() {
        super('formateInstanceNorm');
    }

    transform(...args: any) {
        const [ops] = args;

        // the array length > 4 of inputs.X
        for (let index = 0, len = ops.length; index < len; index++) {
            const opInfo = ops[index];
            if (opInfo.type === 'instance_norm') {
                // 取到input mean vavariance key
                const { X, Variance, Mean } = opInfo.inputs;

                // 构造instance_norm_mean 和instance_norm_variance 算子
                const instanceNormMeanOp: ModelOp = {
                    attrs: {
                    },
                    inputs: {
                        X: X
                    },
                    outputs: {
                        Out: [Mean[0]]
                    },
                    type: 'instance_norm_mean'
                };

                const instanceNormVarianceOp: ModelOp = {
                    attrs: {
                        epsilon: opInfo.attrs.epsilon || 0.000009999999747378752
                    },
                    inputs: {
                        X: X,
                        Mean: [Mean[0]]
                    },
                    outputs: {
                        Out: [Variance[0]]
                    },
                    type: 'instance_norm_variance'
                };

                ops.splice(index, 0, instanceNormVarianceOp);
                ops.splice(index, 0, instanceNormMeanOp);
                index += 2;
                len += 2;
            }
        }
    }
}