
import TexturePacking from './texturePacking';
import FormatInputsX from './formatInputsX';
import type Transformer from './transformer';

interface TransformerAction {
    preTransforms: Transformer[];
    transforms: Transformer[];
    postTransforms: Transformer[];
};

const actions: TransformerAction = {
    preTransforms: [],
    transforms: [
        new TexturePacking(),
        new FormatInputsX()
    ],
    postTransforms: []
};

export default actions;