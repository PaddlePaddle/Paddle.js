/**
 * @file texture_packing
 */

import { GLOBALS } from '../globals';
import env from '../env';
import OpExecutor from '../opFactory/opExecutor';
import Transformer from './transformer';

const packedOpConditions = {
    conv2d: (op, vars) => {
        const strides = op.attrs.strides;
        const inputName = op.inputs.Input[0];
        const filterName = op.inputs.Filter[0];

        if (inputName === 'image') {
            return false;
        }
        const inputOpData = vars.find(item => item.name === inputName);
        const inputShape = inputOpData.shape;
        // let inputData = inputOpData.data;
        const filterOpData = vars.find(item => item.name === filterName);
        const filterShape = filterOpData.shape;
        // let filterData = filterOpData.data;
        // model 里 模型shape 可能不全
        if (
            !strides.find(item => item > 1) // just support stride 1
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

/**
 * Create an packed2unpackedOp
 * @param {Object} conf
 * @param {string} conf.inputName - op inputname
 * @param {string} conf.outputName - op outputname
 * @returns {Object} packed2unpackedOp
 */
function createPacked2unpackedOp({
    inputName,
    outputName
}) {
    const newOp = {
        type: 'packed_2_unpacked',
        attrs: {},
        inputs: {
            Input: [inputName]
        },
        outputs: {
            Output: [outputName]
        }
    };
    return newOp;
}

/**
 * Create an unpacked2packedOp
 * @param {Object} conf
 * @param {string} conf.inputName - op inputname
 * @param {string} conf.outputName - op outputname
 * @returns {Object} unpacked2packedOp
 */
function createUnpacked2packedOp({
    inputName,
    outputName
}) {
    const newOp = {
        type: 'unpacked_2_packed',
        attrs: {},
        inputs: {
            Input: [inputName]
        },
        outputs: {
            Output: [outputName]
        }
    };
    return newOp;
}


/**
 * transform origin op which supports pack
 * @param {Object} op - origin op
 * @param {OpExecutor[]} opsMap ops map
 * @returns {Object} transformed op
 */
function transformOriginOp(op, opsMap) {
    Object.keys(op.inputs)
        .forEach(key => {
            op.inputs[key] = [`${op.inputs[key]}_packed`];
        });
    Object.keys(op.outputs)
        .forEach(key => {
            op.outputs[key] = [`${op.outputs[key]}_packed`];
        });
    op.type = `${op.type}_packing`;
    op.id = `${op.type}_${+new Date()}_${opsMap.length}`;
    op.isPacked = true;
}

export default class TexturePacking extends Transformer {
    constructor() {
        super('TexturePacking');
    }

    transform(...args: any) {
        // wegbl backend 单独处理，开启 webgl pack flag 才处理
        if (GLOBALS.backend !== 'webgl' || !env.get('webgl_pack_channel')) {
            return;
        }

        const [originOp, vars, opsMap] = args;

        // because conv2d and depthwise_conv2d are same.
        const opType = originOp.type === 'depthwise_conv2d' ? 'conv2d' : originOp.type;
        const conditionFunc = packedOpConditions[opType];

        if (!(conditionFunc && conditionFunc(originOp, vars))) {
            return;
        }

        const {
            inputs,
            outputs
        } = originOp;
        const connectInputName = inputs.Input[0];
        const connectOutputName = outputs.Output[0];
        const unpacked2packedOp = createUnpacked2packedOp({
            inputName: connectInputName,
            outputName: `${connectInputName}_packed`
        });
        const unpacked2packedOpIdx = opsMap.length;
        opsMap.push(new OpExecutor(unpacked2packedOp, unpacked2packedOpIdx));

        // deal with origin packed op
        transformOriginOp(originOp, opsMap);

        // deal with packed2unpacked op
        const packed2unpackedOp = createPacked2unpackedOp({
            inputName: `${connectOutputName}_packed`,
            outputName: connectOutputName
        });
        const packed2unpackedOpIdx = opsMap.length + 1;
        opsMap.push(new OpExecutor(packed2unpackedOp, packed2unpackedOpIdx));
    }
}

