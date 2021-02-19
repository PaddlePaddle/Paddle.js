#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import json
import collections
import math
import sys
import os
import struct
import argparse
import shutil
import stat
import traceback
import numpy as np
import paddle.fluid as fluid
import paddle as paddle


# 输入模型所在目录
modelDir = None
# 输入模型名
modelName = None
# 输入参数名，当且仅当所有模型参数被保存在一个单独的二进制文件中，它才需要被指定，若为分片模型，请设置为None
paramsName = None
# 是否打印模型信息
enableLogModelInfo = False
# 输出模型目录
outputDir = None
# 分片文件大小，单位：KB
sliceDataSize = 4 * 1024
# paddlepaddle运行程序实例
program = None
# 存放模型结构
modelInfo = {"vars": [], "ops": [], "chunkNum": 0}
# 存放参数数值（未排序）
paramValuesDict = {}

def logModel(info):
    """ 打印信息 """
    if enableLogModelInfo:
        print(info)

def sortDict(oldDict, reverse=False):
    """ 对字典进行排序，返回有序字典，默认升序 """
    # 获得排序后的key list
    keys = sorted(oldDict.keys(), reverse=reverse)
    orderDict = collections.OrderedDict()
    # 遍历 key 列表
    for key in keys:
        orderDict[key] = oldDict[key]
    return orderDict

def dumpModelToJsonFile():
    """ 导出模型数据到json文件 """
    print("Dumping model structure to json file...")
    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
    outputModelPath = os.path.join(outputDir, "model.json")
    with open(outputModelPath, 'w') as outputFile:
        json.dump(modelInfo, outputFile, indent=4, separators=(", ", ": "), sort_keys=True)
    print("Dumping model structure to json file successfully")

def sliceDataToBinaryFile(paramValueList):
    """ 将参数数据分片输出到文件，默认分片策略为按4M分片 """
    totalParamValuesCount = len(paramValueList)
    countPerSlice = int(sliceDataSize * 1024 / 4)

    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
    currentChunkIndex = 0
    currentParamDataIndex = 0

    while currentParamDataIndex < totalParamValuesCount - 1:
        remainCount = totalParamValuesCount - currentParamDataIndex
        if remainCount < countPerSlice:
            countPerSlice = remainCount
        chunkPath = os.path.join(outputDir, 'chunk_%s.dat' % (currentChunkIndex + 1))
        file = open(chunkPath, 'wb')
        for i in paramValueList[currentParamDataIndex : currentParamDataIndex + countPerSlice]:
            byte = struct.pack('f', float(i))
            file.write(byte)
        file.close()
        currentParamDataIndex = currentParamDataIndex + countPerSlice
        currentChunkIndex = currentChunkIndex + 1
        print("Output No." + str(currentChunkIndex)+ " binary file, remain " + str(totalParamValuesCount - currentParamDataIndex) + " param values.")
    print("Slicing data to binary files successfully. (" + str(currentChunkIndex)+ " output files and " + str(currentParamDataIndex) + " param values)")

def reorderParamsValue():
    """ 对参数文件中的数值，按照variable.name字母序排序，返回排序后组合完成的value list """
    paramValuesOrderDict = sortDict(paramValuesDict)
    paramValues = []
    for value in paramValuesOrderDict.values():
        paramValues += value
    return paramValues

def mapToPaddleJSTypeName(fluidOPName):
    """ 处理fluid的OP type与PaddleJS的OP type不对应情况 """
    if fluidOPName == "batch_norm":
        return "batchnorm"
    return fluidOPName  

def organizeModelVariableInfo():
    """ 组织参数信息 """
    print("Organizing model variables info...")
    index = 0
    # 存放var信息（未排序）
    varInfoDict = {}
    # 获取program中所有的var，遍历并获取所有未排序的var信息和参数数值
    vars = list(program.list_vars())
    for v in vars:
        # 跳过feed和fetch
        if "feed" == v.name:
            continue
        if "fetch" == v.name:
            continue

        varShape = list(v.shape)

        # FIXME:start paddlejs 不支持shape中为-1，这里需要手动过滤一下，支持了以后可以删除
        varShapeExcludeNegativeOne = []
        for s in varShape:
            if s == -1:
                continue
            varShapeExcludeNegativeOne.append(s)
        varShape = varShapeExcludeNegativeOne
        # FIXME:end

        # 存放variable信息，在dump成json时排序
        varInfo = {}
        varInfo["shape"] = varShape
        # 数据是否是持久化数据，如tensor为持久化数据，op的output不是持久化数据
        # 只输出持久化数据，paddlejs中也仅读取持久化数据
        varInfo["persistable"] = v.persistable
        varInfoDict[v.name] = varInfo
       
        logModel("[Var index:" + str(index) + " name:" + v.name + "]")
        jsonDumpsIndentStr = json.dumps(varInfo, indent=2)
        logModel(jsonDumpsIndentStr)
        logModel("")
        index += 1

        # persistable数据存入paramValuesDict，等待排序
        if v.persistable:
            data = np.array(fluid.global_scope().find_var(v.name).get_tensor()).flatten().tolist()
            paramValuesDict[v.name] = data

    # 对var信息dict，按照key（var名）进行字母顺序排序
    varInfoOrderDict = sortDict(varInfoDict)

    # 将var信息按照顺序，添加到model info的vars中
    for key, value in varInfoOrderDict.items():
        value["name"] = key
        modelInfo["vars"].append(value)
    print("Organizing model variables info successfully.")

def organizeModelOpInfo():
    """ 组织模型OP结构信息 """
    print("Organizing model operators info...")
    ops = program.current_block().ops
    feedOutputName = None
    index = 0
    for op in ops:
        opInfo = {}

        # 获取OP type，需要映射到PaddleJS的名字
        opInfo["type"] = mapToPaddleJSTypeName(op.type)
        
        # 获取OP input
        inputs = {}
        for name in op.input_names:
            value = op.input(name)
            if len(value) <= 0:
                continue
            if value[0] == feedOutputName:
                # FIXME:workaround,PaddleJSfeed 输入必须是image，且为单输入，这里修改feed后面的OP的input为image，建立前后关联
                inputs[name] = ["image"]
            else:
                inputs[name] = value
        opInfo["inputs"] = inputs
        
        # 获取OP output
        outputs = {}
        for name in op.output_names:
            value = op.output(name)
            if len(value) <= 0:
                continue
            if op.type == "feed":
                # FIXME:workaround,PaddleJSfeed 输入必须是image，且为单输入，这里保存原始的输出名，以便映射
                feedOutputName = value[0]
                outputs[name] = ["image"]
            else:
                outputs[name] = value
        opInfo["outputs"] = outputs

        # 获取OP attribute    
        attrs = {}
        for name in op.attr_names:
            # 过滤不需要的参数
            if name in ["op_callstack", 'col', 'op_role', 'op_namescope', 'op_role_var']:
                continue
            value = op.attr(name)
            attrs[name] = value
        opInfo["attrs"] = attrs

        # 存入modelInfo 
        modelInfo["ops"].append(opInfo)
        logModel("[OP index:" + str(index) + " type:" + op.type + "]")
        jsonDumpsIndentStr = json.dumps(opInfo, indent=2)
        logModel(jsonDumpsIndentStr)
        logModel("")
        index += 1
    print("Organizing model operators info successfully.")


def addChunkNumToJson(paramValueList):
    totalParamValuesCount = len(paramValueList)
    countPerSlice = int(sliceDataSize * 1024 / 4)
    count = totalParamValuesCount / countPerSlice
    modelInfo["chunkNum"] = math.ceil(count)
    print("Model chunkNum set successfully.")


def convertToPaddleJSModel():
    """ 转换fluid modle为paddleJS model """


    #In PaddlePaddle 2.x, we turn on dynamic graph mode by default, and 'load_inference_model()' is only supported in static graph mode. So  call 'paddle.enable_static()' before this api to enter static graph mode.
    paddle.enable_static()
    
    # 初始化fluid运行环境和配置
    exe = fluid.Executor(fluid.CPUPlace())
    result = fluid.io.load_inference_model(dirname=modelDir, executor=exe, model_filename=modelName, params_filename=paramsName)
    global program
    program = result[0]
    
    # 获取program中所有的op，按op顺序加入到model info
    organizeModelOpInfo()

    # 获取program中所有的var，按照字母顺序加入到model info，同时读取参数数值
    organizeModelVariableInfo()

    # 对参数数值dict，按照key（参数名）进行字母顺序排序，并组合到一起
    paramValues = reorderParamsValue()

    # model.json 设置分片参数
    addChunkNumToJson(paramValues)
    # 导出模型文件到json
    dumpModelToJsonFile()

    # 导出分片参数文件
    sliceDataToBinaryFile(paramValues) 

if __name__ == "__main__":
    try:
        p = argparse.ArgumentParser(description='模型转换参数解析')
        p.add_argument('--inputDir', help='fluid模型所在目录。当且仅当使用分片参数文件时使用该参数。将过滤modelPath和paramsPath参数，且模型文件名必须为`__model__`', required=False)
        p.add_argument('--modelPath', help='fluid模型文件所在路径，使用合并参数文件时使用该参数', required=False)
        p.add_argument('--paramPath', help='fluid参数文件所在路径，使用合并参数文件时使用该参数', required=False)
        p.add_argument("--outputDir", help='paddleJS模型输出路径，必要参数', required=True)
        p.add_argument("--logModelInfo", type=int, default=0, help='是否输出模型结构信息，非必要参数，0为不输出，1为输出，默认不输出', required=False)
        p.add_argument("--sliceDataSize", type=int, default=4096, help='分片输出参数文件时，每片文件的大小，单位：KB，非必要参数，默认4096KB', required=False)
        
        args = p.parse_args()
        modelDir = args.inputDir
        modelPath = args.modelPath
        paramPath = args.paramPath
        if not modelDir:
            modelDir, modelName = os.path.split(modelPath)
            paramDir, paramsName = os.path.split(paramPath)
            if paramDir != modelDir:
                print("\033[31mModel and param file should be put in a same directory!\033[0m")
                raise Exception()
        outputDir = args.outputDir
        sliceDataSize = args.sliceDataSize

        if args.logModelInfo == 1:
            enableLogModelInfo = True

        convertToPaddleJSModel()

    except Exception as identifier:
        print("\033[31mA fetal error occured. Failed to convert model.\033[0m")
        print(traceback.format_exc())
        pass