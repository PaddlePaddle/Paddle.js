import TexturePacking from './texturePacking';
import FormatInputsX from './formatInputsX';
import type Transformer from './transformer';
import SplitOp from './splitOp';
import PackOutOp from './packOutOp';
import FeedProcess from './feedProcess';
import OptModel from './optModel';
import FormateInstanceNorm from './formatInstanceNorm';

interface TransformerAction {
    preTransforms: Transformer[];
    transforms: Transformer[];
    postTransforms: Transformer[];
};

const actions: TransformerAction = {
    preTransforms: [
        new SplitOp(),
        new FormateInstanceNorm(),
        new PackOutOp(),
        new FeedProcess(),
        new OptModel()
    ],
    transforms: [
        new FormatInputsX(),
        new TexturePacking()
    ],
    postTransforms: []
};

export default actions;