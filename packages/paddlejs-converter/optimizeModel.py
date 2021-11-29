#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import collections
import argparse
import traceback
from paddlelite import lite
import pkg_resources
from packaging import version

lite_version = pkg_resources.get_distribution("paddlelite").version

def optimizeModel(inputDir, modelPath, paramPath, outputDir):
    """ 使用opt python接口执行模型优化 """
    opt = lite.Opt()
    if inputDir:
        # 分片参数文件优化
        opt.set_model_dir(inputDir)
    else:
        # 合并参数文件优化
        opt.set_model_file(modelPath)
        opt.set_param_file(paramPath)

    opt.set_valid_places("arm")
    opt.set_model_type("protobuf")
    opt.set_optimize_out(outputDir)

    if version.parse(lite_version) <= version.parse('2.7.1'):
        print("python paddlelite version: " + lite_version)

        optimize_passes = [
            "lite_conv_elementwise_fuse_pass",
            "lite_conv_bn_fuse_pass",
            "lite_conv_elementwise_fuse_pass",
            "lite_conv_activation_fuse_pass",
            "lite_var_conv_2d_activation_fuse_pass",
            "lite_fc_fuse_pass",
            "lite_shuffle_channel_fuse_pass",
            "lite_transpose_softmax_transpose_fuse_pass",
            "lite_interpolate_fuse_pass",
            "identity_scale_eliminate_pass",
            "elementwise_mul_constant_eliminate_pass",
            "lite_sequence_pool_concat_fuse_pass",
            "lite_elementwise_add_activation_fuse_pass",
            "static_kernel_pick_pass",
            "variable_place_inference_pass",
            "argument_type_display_pass",
            "type_target_cast_pass",
            "variable_place_inference_pass",
            "argument_type_display_pass",
            "io_copy_kernel_pick_pass",
            "argument_type_display_pass",
            "variable_place_inference_pass",
            "argument_type_display_pass",
            "type_precision_cast_pass",
            "variable_place_inference_pass",
            "argument_type_display_pass",
            "type_layout_cast_pass",
            "argument_type_display_pass",
            "variable_place_inference_pass",
            "argument_type_display_pass",
            "runtime_context_assign_pass",
            "argument_type_display_pass"
        ]
        opt.set_passes_internal(optimize_passes)

    opt.run()


def main():
    try:
        p = argparse.ArgumentParser('模型优化参数解析')
        p.add_argument('--inputDir', help='fluid模型所在目录。当且仅当使用分片参数文件时使用该参数。将过滤modelPath和paramsPath参数，且模型文件名必须为`__model__`', required=False)
        p.add_argument('--modelPath', help='fluid模型文件所在路径，使用合并参数文件时使用该参数', required=False)
        p.add_argument('--paramPath', help='fluid参数文件所在路径，使用合并参数文件时使用该参数', required=False)
        p.add_argument("--outputDir", help='优化后fluid模型目录，必要参数', required=True)
       
        args = p.parse_args()
        inputDir = args.inputDir
        modelPath = args.modelPath
        paramPath = args.paramPath
        outputDir = args.outputDir

        optimizeModel(inputDir, modelPath, paramPath, outputDir)
            
    except Exception as identifier:
        print("\033[31mA fetal error occured. Failed to optimize model.\033[0m")
        print(traceback.format_exc())
        pass


if __name__ == "__main__":
    main()