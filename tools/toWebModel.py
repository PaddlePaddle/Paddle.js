#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import json
import paddle.fluid as fluid
import paddle
import numpy as np
import collections
import math
import sys as sys
import os
import struct

#常量控制
#抽样打印数据数量
logDataCount = 50

# 输入模型所在目录
modelDir = "infer_model/MobileNetV2/"
# 输入模型名
modelName = "model"
# 输入参数名，当且仅当所有模型参数被保存在一个单独的二进制文件中，它才需要被指定，若为分片模型，请设置为None
paramsName = "params"
# 模型feed shape
inputShape = (1, 3, 224, 224)
# 输入数据
inputData = np.full(inputShape, 1, "float32")
# 输出模型目录
outputDir = "../dist/model/mobileNet/"
# 权重分片扩展名
extensionName = ".dat"
# 输出各var数据
outputVarData = False

# 确认fluid的版本号
print(paddle.__version__)

# 采样输出list数据，采样的个数logDataCount为常量
def stridePrint1(data):
    dataCount = len(data)
    stride = math.floor(dataCount / logDataCount)
    if stride == 0:
        stride = 1
    nums = []
    # outputCount = logDataCount
    # if dataCount < logDataCount:
    #     outputCount = dataCount
    # for i in range(outputCount):
    #     # nums.append(str(i) + ": " + str(data[i]))
    #     nums.append(data[i])
    
    for i in range(0, logDataCount):
        item = data[i * stride]
        nums.append(str(i * stride) + ": " + str(item))
    print(nums)

def stridePrint(tensor):
    length = len(tensor)
#    if length < 3000:
#        print(tensor)
#        return
    size = 20
    stride = math.floor(length / size)
    if stride == 0:
        stride = 1
    size = math.floor(length / stride)
    nums = []
    for i in range(0, size):
        item = tensor[i * stride]
        nums.append(str(i * stride) + ": " + str(item))
    print(nums)




# 对字典进行排序，返回有序字典，默认升序
def sortDict(oldDict, reverse = False):
    # 获得排序后的key list
    keys = sorted(oldDict.keys(), reverse = reverse)
    orderDict = collections.OrderedDict()
    # 遍历 key 列表
    for key in keys:
        orderDict[key] = oldDict[key]
    return orderDict


# 将权重数据分片输出到文件，默认分片策略为按4M分片
def sliceDataToBinaryFile(weightValueList, sliceMethod = 0):
    # TODO: 分片这里不太对，待修改
    totalWeightCount = len(weightValueList)
    countPerSlice = 0
    # sliceCount = 0
    if sliceMethod == 0:
        # 分片策略 0:按4M分片
        countPerSlice = int(4 * 1024 * 1024 / 4)
        # sliceCount = math.ceil(totalWeightCount / countPerSlice)
    else:
        # 分片策略 1:按<=4M等分
        # TODO: 待实现
        countPerSlice = 0
        # sliceCount = 0

    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
    currentChunkIndex = 0
    currentWeightIndex = 0

    while currentWeightIndex < totalWeightCount - 1:
        remainCount = totalWeightCount - currentWeightIndex
        if remainCount < countPerSlice:
            countPerSlice = remainCount
        chunkPath = outputDir + 'chunk_%s' % (currentChunkIndex + 1) + extensionName
        file = open(chunkPath, 'wb')
        for i in weightValueList[currentWeightIndex : currentWeightIndex + countPerSlice]:
            byte = struct.pack('f', float(i))
            file.write(byte)
        file.close()
        currentWeightIndex = currentWeightIndex + countPerSlice
        currentChunkIndex = currentChunkIndex + 1
        # for debug
        print("第" + str(currentChunkIndex + 1) + "片权重输出完毕，输出个数：" + str(countPerSlice) + " 剩余个数:" + str(totalWeightCount - currentWeightIndex))

    # for debug
    print("========权重输出完毕，共" + str(currentWeightIndex) + "个数据，" + str(currentChunkIndex) + "个分片文件" + "========")

# 处理fluid的OP type与PaddleJS的OP type不对应情况
def mapToPaddleJSTypeName(fluidOPName):
    if fluidOPName == "batch_norm":
        return "batchnorm"
    return fluidOPName


# 将shape扩充为4维
def padToFourDimShape(shape):
    fourDimShape = []
    if len(shape) == 4:
        fourDimShape = shape
    elif len(shape) < 4:
        for i in range(0, 4 - len(shape)):
            fourDimShape.append(1)
        fourDimShape = fourDimShape + shape
    else:
        return []
    return fourDimShape


# for debug，将NCHW排布的数据转为NHWC排布的数据
def convertNCHW2NHWC(data, shape):
    fourDimShape = padToFourDimShape(shape)
    N = fourDimShape[0]
    C = fourDimShape[1]
    H = fourDimShape[2]
    W = fourDimShape[3]
    print(fourDimShape)
    HXW = H * W
    CXHXW = C * H * W
    index = 0
    nhwcData = []
    for n in range(0, N):
        for h in range(0, H):
            for w in range(0, W):
                for c in range(0, C):
                    nhwcData.append(data[n * CXHXW + c * HXW + h * W + w])
                    index = index + 1
    return nhwcData

# for debug 输出特定varName对应的数据
def writeTempOutputData(name):
    # FIXME:待完善
    return
    dataList = np.array(fluid.global_scope().find_var(name).get_tensor()).flatten().tolist()
    path = '/Users/bluebird/baidu/fluid_tools/check-temp/filter.txt'
    if os.path.exists(path):
        os.remove()
        file = open(path,'a')
        for a in range(0, len(dataList)):
            file.write(str(dataList[a]))
            file.write(",")
        file.close()

def convertToPaddleJSModel():
    # 1. 初始化fluid运行环境和配置
    exe = fluid.Executor(fluid.CPUPlace())
    [prog, feed_target_names, fetch_targets] = fluid.io.load_inference_model(dirname=modelDir, executor=exe, model_filename=modelName, params_filename=paramsName)
    out = exe.run(prog, feed={feed_target_names[0]: inputData}, fetch_list=fetch_targets, return_numpy=False)
    print(out)
    
    index = 0
    # 存放模型结构
    modelInfo = {"vars": [], "ops": []}
    # 存放var信息（未排序）
    varInfoDict = {}
    # 存放权重数值（未排序）
    weightValueDict = {}

    # 2. 获取program中所有的var，遍历并获取所有未排序的var信息和权重数值
    vars = list(prog.list_vars())
    for v in vars:
        # 跳过feed和fetch
        if "feed" == v.name:
            continue
        if "fetch" == v.name:
            continue

        print("Var index:" + str(index) + " name:" + v.name)
        print(v)
        index += 1

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
        # 数据是否是持久化数据，如weight为持久化数据，op的output不是持久化数据
        # 只输出持久化数据，paddlejs中也仅读取持久化数据
        varInfo["persistable"] = v.persistable
        varInfoDict[v.name] = varInfo
        
        # for debug，输出var变量
        if outputVarData:
            writeTempOutputData(v.name)

        # persistable数据存入weightDict，等待排序
        if v.persistable:
            data = np.array(fluid.global_scope().find_var(v.name).get_tensor()).flatten().tolist()
            weightValueDict[v.name] = data

    # 3. 对var信息dict，按照key（var名）进行字母顺序排序
    varInfoOrderDict = sortDict(varInfoDict)

    # 4. 将var信息按照顺序，添加到model info的vars中
    for key, value in varInfoOrderDict.items():
        value["name"] = key
        modelInfo["vars"].append(value)
    
    # 5. 对权重数值dict，按照key（权重名）进行字母顺序排序，并组合到一起
    weightValueOrderDict = sortDict(weightValueDict)
    weightValues = []
    for key, value in weightValueOrderDict.items():
        weightValues += value
    
    # 6. 分片输出权重
    sliceDataToBinaryFile(weightValues)

    # 7. 获取program中所有的op，按op顺序加入到model info
    ops = prog.current_block().ops
    feedOutputName = None
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
                # FIXME:workaround,PaddleJSfeed 输入必须是image，且为单输入
                # 这里修改feed后面的OP的input为image，建立前后关联
                # 这里可能会有问题
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
                # FIXME:workaround,PaddleJSfeed 输入必须是image，且为单输入
                # 这里可能会有问题
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

    # 8. 模型信息按照key字母顺序导出到json
    outputModelPath = outputDir + "model.json"
    with open(outputModelPath, 'w') as outputFile:
        json.dump(modelInfo, outputFile, indent = 4, separators=(", ", ": "), sort_keys = True)

    print("========模型结构输出完毕========")

convertToPaddleJSModel()