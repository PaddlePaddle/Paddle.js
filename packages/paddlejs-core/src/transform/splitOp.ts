/**
 * @file graph transformer
 */

import Transformer from './transformer';
function getTensorShapeFromVals(name, vars) {
    const  result = vars.filter(item => item.name === name);
    return result.length ? result[0].shape : []
}

function buildOutputVarInfo(inputs, outputShape, axis, vars) {
    // calculate shape
    const shape = [...outputShape];
    let shapeSum = 0;
    for (let input of inputs) {
        const curShape = getTensorShapeFromVals(input, vars);
        shapeSum += curShape[axis];
    }

    shape[axis] = shapeSum;
    const outName = inputs[inputs.length - 1] + '_out';

    // build new output varInfo
    const newVar = {
        name: outName,
        shape: shape
    };

    // outputOpInfo & outputOpVars
    return newVar;
}
export default class SplitOp extends Transformer {
    constructor() {
        super('splitOp');
    }

    transform(...args: any) {
        const [ops, vars] = args;
        // the array length > 4 of inputs.X
        for (let index = 0, len = ops.length; index < len; index++) {
            const opInfo = ops[index];
            if (opInfo.type !== 'concat' || !opInfo.inputs?.X || opInfo.inputs.X.length <= 4) {
                continue;
            }

            const { attrs, inputs: opInputs, outputs } = opInfo;
            const inputs = opInputs.X;
            const inputsLen = inputs.length;

            // every new op has 3 inputs except the first op, which has 4 inputs.
            const opLen = Math.ceil((inputsLen - 4) / 3) + 1;
            const outputName = outputs.Out[0];
            const outputShape = getTensorShapeFromVals(outputName, vars);

            // handle axis
            let axis = attrs.axis || 0;
            axis = axis > -1 ? axis : outputShape.length + axis;

            const varList = [];
            const opList = [];
            let firstOpInputs = inputs.slice(0, 4);
            let prevVar;

            for (let i = 0; i < opLen; i++) {
                // construct new Op
                const curOpInputs = i === 0
                    ? firstOpInputs
                    : inputs.slice(i * 3 + 1, (i + 1) * 3 + 1);

                const outputVar = buildOutputVarInfo(curOpInputs, outputShape, axis, vars);
                console.log(outputVar.name)

                // concat prev op info
                i !== 0 && curOpInputs.splice(0, 0, prevVar.name);
                outputVar.shape[axis] += prevVar ? prevVar.shape[axis] : 0;

                const outputs = {Out: [outputVar.name]};
                opList.push({attrs, inputs: {X: curOpInputs}, outputs, type: 'concat'});
                varList.push(outputVar);
                prevVar = outputVar;
            }

            // change outputname of next op
            opList[opLen - 1].outputs.Out = [outputName];
            ops.splice(index, 1, ...opList);
            vars.splice(vars.length - 1, 0, ...varList);
        }
    }
}

