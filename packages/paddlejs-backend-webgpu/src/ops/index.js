/**
 * @file op文件
 * @author zhangjingyuan02
 */

import * as utils from './utils';

import mul_params from './mul/params';
import mul_main from './mul/main';

import conv2d_params from './conv2d/params';
import conv2d_main from './conv2d/main';
import conv2d_deps from './conv2d/deps';

import concat_params from './concat/params';
import concat_main from './concat/main';
import concat_deps from './concat/deps';

import concat_mul_params from './concat_mul/params';
import concat_mul_main from './concat_mul/main';
import concat_mul_deps from './concat_mul/deps';

import split_params from './split/params';
import split_main from './split/main';
import split_deps from './split/deps';

import elementwise_add_params from './elementwise_add/params';
import elementwise_add_main from './elementwise_add/main';
import elementwise_add_deps from './elementwise_add/deps';


import getOutputTensorPos from './funcs/getOutputTensorPos';
import getValueFromTensorPos from './funcs/getValueFromTensorPos';
import transferFromNHWCtoNCHW from './funcs/transferFromNHWCtoNCHW';

export const ops = {
    mul: {
        params: mul_params,
        main: mul_main,
        behaviors: [
            'reshape'
        ]
    },
    concat: {
        params: concat_params,
        main: concat_main,
        deps: concat_deps,
        behaviors: [
            'normalizeDim',
            'normalizeDim2'
        ]
    },
    concat_mul: {
        params: concat_mul_params,
        main: concat_mul_main,
        deps: concat_mul_deps,
        behaviors: [
            'normalizeDim',
            'normalizeDim2'
        ]
    },
    conv2d: {
        params: conv2d_params,
        main: conv2d_main,
        deps: conv2d_deps,
        behaviors: [
            'adaptPaddings',
            'isApplySeparableConv',
            'batchComputeConv2d',
            'processBias'
        ]
    },
    elementwise_add: {
        params: elementwise_add_params,
        main: elementwise_add_main,
        deps: elementwise_add_deps,
        behaviors: [
            'processAxis'
        ]
    },
    split: {
        params: split_params,
        main: split_main,
        deps: split_deps,
        behaviors: [
            'normalizeDim'
        ]
    }
};

export const atoms = {
    getOutputTensorPos,
    getValueFromTensorPos,
    transferFromNHWCtoNCHW
};

export {
    utils
};
