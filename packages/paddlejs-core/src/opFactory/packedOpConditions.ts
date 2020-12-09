/**
 * @file 判断 op 是否支持 packed
 */

import { ModelVar, ModelOp } from '../commons/interface';

interface PackedOpConditions {
    [key: string]: Function;
}

const packedOpConditions: PackedOpConditions = {
    conv2d_packed: (op: ModelOp, vars: ModelVar[]): boolean => {
        const strides = op.attrs ? op.attrs.strides : [];
        const inputName = op.inputs.Input[0];
        const filterName = op.inputs.Filter[0];

        if (inputName === 'image') {
            return false;
        }
        const inputOpData: ModelVar | undefined = vars.find(item => item.name === inputName);
        const filterOpData: ModelVar | undefined = vars.find(item => item.name === filterName);
        if (!inputOpData || !filterOpData) {
            return false;
        }
        const inputShape = inputOpData.shape;
        const filterShape = filterOpData.shape;
        // model 里 模型shape 可能不全
        if (
            !strides.find(item => +item > 1) // just support stride 1
            && inputShape[inputShape.length - 1 - 2] % 4 === 0 // input channel % 4 === 0
            && filterShape.length === 4 // filter batch !== 1
            && filterShape[0] % 4 === 0 // filter batch % 4 === 0
            && filterShape[1] % 4 === 0 // filter channel % 4 === 0
        ) {
            return true;
        }

        return false;

    }
};

export default packedOpConditions;
