/**
 * @file op文件
 * @author zhangjingyuan02
 */

import mul_params from './mul/params';
import mul_main from './mul/main';

import conv2d_params from './conv2d/params';
import conv2d_main from './conv2d/main';
import conv2d_deps from './conv2d/deps';

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
            'reshape',
            'needBatch'
        ]
    },
    conv2d: {
        params: conv2d_params,
        main: conv2d_main,
        deps: conv2d_deps,
        behaviors: [
            'needBatch',
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
            'processAxis',
            'needBatch'
        ]
    }
};

export const atoms = {
    getOutputTensorPos,
    getValueFromTensorPos,
    transferFromNHWCtoNCHW
};

