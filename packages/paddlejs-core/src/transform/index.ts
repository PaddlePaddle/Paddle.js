import TexturePacking from './texturePacking';
import FormatInputsX from './formatInputsX';
import type Transformer from './transformer';
import SplitOp from './splitOp';

interface TransformerAction {
    preTransforms: Transformer[];
    transforms: Transformer[];
    postTransforms: Transformer[];
};

const actions: TransformerAction = {
    preTransforms: [
        new SplitOp()
    ],
    transforms: [
        new FormatInputsX(),
        new TexturePacking()
    ],
    postTransforms: []
};

export default actions;