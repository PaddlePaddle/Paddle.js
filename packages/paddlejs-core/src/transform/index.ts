
import { GLOBALS } from '../globals';
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
        new FormatInputsX()
    ],
    postTransforms: []
};

// wegbl backend单独处理, 在第一个transform后面添加texturePacking
if (GLOBALS.backend === 'webgl') {
    actions.transforms.splice(1, 0, new TexturePacking());
}

export default actions;