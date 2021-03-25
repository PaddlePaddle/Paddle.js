/**
 * @file op文件
 * @author yueshuangyan
 */

import * as conv2d  from './conv2d';
import * as conv2d_depthwise  from './conv2d_depthwise';
import * as batchnorm from './batchnorm';
import * as elementwise_add from './elementwise_add';
import * as pool2d from './pool2d';
import * as softmax from './softmax';
import * as dynamic from './dynamic';

export {
    conv2d,
    conv2d_depthwise,
    batchnorm,
    pool2d,
    softmax,
    elementwise_add,
    dynamic
};

