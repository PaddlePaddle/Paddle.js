/**
 * @file op文件
 * @author yueshuangyan
 */

import conv2d from './shader/conv2d';
import conv2d_packing from './shader/conv2d_packing';
import conv2d_transpose from './shader/conv2d_transpose';
import conv2d_depthwise from './shader/conv2d_depthwise';
import depthwise_conv2d from './shader/depthwise_conv2d';
import conv2d_elementwise_add from './shader/conv2d_elementwise_add';
import pool2d from './shader/pool2d';
import pool2d_max from './shader/pool2d_max';
import pool2d_winograd from './shader/pool2d_winograd';
import elementwise_add from './shader/elementwise_add';
import mul from './shader/mul';
import fc from './shader/fc';
import concat from './shader/concat';
import concat_mul from './shader/concat_mul';
import split from './shader/split';
import batchnorm from './shader/batchnorm';
import reshape2 from './shader/reshape2';
import bilinear_interp from './shader/bilinear_interp';
import transpose2 from './shader/transpose2';
import softmax from './shader/softmax';
import dynamic from './shader/dynamic';
import unpacked_2_packed from './shader/unpacked_2_packed';
import packed_2_unpacked from './shader/packed_2_unpacked';

const ops = {
    conv2d,
    conv2d_packing,
    conv2d_transpose,
    depthwise_conv2d,
    conv2d_depthwise,
    conv2d_elementwise_add,
    pool2d,
    pool2d_max,
    pool2d_winograd,
    elementwise_add,
    mul,
    fc,
    concat,
    concat_mul,
    split,
    softmax,
    batchnorm,
    reshape2,
    bilinear_interp,
    transpose2,
    unpacked_2_packed,
    packed_2_unpacked,
    prelu: dynamic('prelu'),
    relu6: dynamic('relu6'),
    leakyRelu: dynamic('leakyRelu'),
    scale: dynamic('scale'),
    sigmoid: dynamic('sigmoid'),
    relu: dynamic('relu')
};
export {
    ops
};
