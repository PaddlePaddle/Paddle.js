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
import matmul from './shader/matmul';
import fc from './shader/fc';
import dropout from './shader/dropout';
import concat from './shader/concat';
import concat_mul from './shader/concat_mul';
import split from './shader/split';
import batchnorm from './shader/batchnorm';
import reshape2 from './shader/reshape2';
import bilinear_interp from './shader/bilinear_interp';
import bilinear_interp_v2 from './shader/bilinear_interp_v2';
import transpose2 from './shader/transpose2';
import softmax from './shader/softmax';
import dynamic from './shader/dynamic';
import elementwise_mul from './shader/elementwise_mul';
import elementwise_div from './shader/elementwise_div';
import arg_max from './shader/arg_max';
import arg_min from './shader/arg_min';
import unsqueeze2 from './shader/unsqueeze2';
import flatten_contiguous_range from './shader/flatten_contiguous_range';
import greater_than from './shader/greater_than';
import reduce_sum from './shader/reduce_sum';
import where from './shader/where';
import connect from './shader/connect';
import squeeze2 from './shader/squeeze2';
import pad3d from './shader/pad3d';
import reduce_mean from './shader/reduce_mean';
import shuffle_channel from './shader/shuffle_channel';
import hard_swish from './shader/hard_swish';
import nearest_interp from './shader/nearest_interp';
import nearest_interp_v2 from './shader/nearest_interp_v2';
import elementwise_pow from './shader/elementwise_pow';
import elementwise_sub from './shader/elementwise_sub';
import cast from './shader/cast';
import fill_constant_batch_size_like from './shader/fill_constant_batch_size_like';
import rnn_matmul from './shader/rnn/rnn_matmul';
import rnn_sigmoid from './shader/rnn/rnn_sigmoid';
import rnn_tanh from './shader/rnn/rnn_tanh';
import rnn_origin from './shader/rnn/rnn_origin';
import pool2d_avg from './shader/pool2d_avg';

import {
    imgFeed, pack_out, nhwc_2_nchw, unpacked_2_packed,
    packed_2_unpacked, feedPost
} from './shader/custom';


const ops = {
    arg_max,
    arg_min,
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
    elementwise_mul,
    elementwise_div,
    elementwise_pow,
    elementwise_sub,
    mul,
    matmul,
    fc,
    dropout,
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
    unsqueeze2,
    flatten_contiguous_range,
    greater_than,
    reduce_sum,
    where,
    connect,
    reduce_mean,
    hard_swish,
    nearest_interp,
    nearest_interp_v2,
    cast,
    fill_constant_batch_size_like,
    rnn_matmul,
    rnn_tanh,
    rnn_sigmoid,
    rnn_origin,
    pool2d_avg,
    prelu: dynamic('prelu'),
    relu6: dynamic('relu6'),
    leakyRelu: dynamic('leakyRelu'),
    scale: dynamic('scale'),
    sigmoid: dynamic('sigmoid'),
    relu: dynamic('relu'),
    hard_sigmoid: dynamic('hard_sigmoid'),
    pow: dynamic('pow'),
    sqrt: dynamic('sqrt'),
    tanh: dynamic('tanh'),
    squeeze2,
    pad3d,
    bilinear_interp_v2,
    shuffle_channel,
    pack_out,
    nhwc_2_nchw,
    feedPost,
    imgFeed
};
export {
    ops
};
