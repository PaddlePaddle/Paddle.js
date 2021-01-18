
import TexturePacking from './texturePacking';
import type Transformer from './transformer';

interface TransformerAction {
    preTransforms: Transformer[];
    transforms: Transformer[];
    postTransforms: Transformer[];
};

const actions: TransformerAction = {
    preTransforms: [],
    transforms: [
        new TexturePacking()
    ],
    postTransforms: []
};

export default actions;