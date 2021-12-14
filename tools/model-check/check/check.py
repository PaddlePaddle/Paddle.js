import paddle.fluid as fluid
import paddle as paddle
import argparse
import traceback
import os
import numpy as np


global pcExceed
pcExceed = []
global wiseExceed
wiseExceed = []
global notSupportOps
notSupportOps = []


def excludeNegativeShape(shape):
    varShape = list(shape)
    varShapeExcludeNegativeOne = []
    for s in varShape:
        # 模型中 ？会自动转为 -1，需要单独处理成 1
        if s == -1:
            s = 1
        varShapeExcludeNegativeOne.append(s)
    return varShapeExcludeNegativeOne


# 计算 tensor 对应 texture shape
def getTextureShapefromLogicalShape(shape):
    textureW = 0
    textureH = 0

    if len(shape) > 4:
        print('\033[93m ' + str(shape) + ' tensor shape length > 4, 处理为丢弃头部shape \033[0m')
        shape = shape[-4:]

    arr = [1]*(4 - len(shape))

    for item in arr:
        shape.insert(0, item)
    
    textureH = shape[0] * shape[2]
    textureW = shape[1] * shape[3]

    return [textureH, textureW]


def getExceedMaxShape(shape, name):
    PC_TEXTURE_LIMIT = 16384
    WISE_TEXTURE_LIMIT = 4096

    height = shape[0]
    width = shape[1]

    if width > PC_TEXTURE_LIMIT:
        # 先按照 width 拆分 4 份，height 叠加 4 份拆分，是否满足，再看拆分 8 份
        if not((width / 4 <= PC_TEXTURE_LIMIT and height * 4 <= PC_TEXTURE_LIMIT)
            or (width / 8 <= PC_TEXTURE_LIMIT and height * 8 <= PC_TEXTURE_LIMIT)
        ):
            pcExceed.append({
                'shape': shape,
                'name': name
            })
    elif height > PC_TEXTURE_LIMIT:
        # 先按照 height 拆分 4 份，width 叠加 4 份拆分，是否满足，再看拆分 8 份
        if not((height / 4 <= PC_TEXTURE_LIMIT and width * 4 <= PC_TEXTURE_LIMIT)
            or (height / 8 <= PC_TEXTURE_LIMIT and width * 8 <= PC_TEXTURE_LIMIT)
        ):
            pcExceed.append({
                'shape': shape,
                'name': name
            })

    if width > WISE_TEXTURE_LIMIT:
        # 先按照 width 拆分 4 份，height 叠加 4 份拆分，是否满足，再看拆分 8 份
        if not((width / 4 <= WISE_TEXTURE_LIMIT and height * 4 <= WISE_TEXTURE_LIMIT)
            or (width / 8 <= WISE_TEXTURE_LIMIT and height * 8 <= WISE_TEXTURE_LIMIT)
        ):
            wiseExceed.append({
                'shape': shape,
                'name': name
            })

    elif height > WISE_TEXTURE_LIMIT:
        # 先按照 width 拆分 4 份，height 叠加 4 份拆分，是否满足，再看拆分 8 份
        if not((height / 4 <= WISE_TEXTURE_LIMIT and width * 4 <= WISE_TEXTURE_LIMIT)
            or (height / 8 <= WISE_TEXTURE_LIMIT and width * 8 <= WISE_TEXTURE_LIMIT)
        ):
            wiseExceed.append({
                'shape': shape,
                'name': name
            })



def read_txt_data(file_name, num_per_line=1):
    """
    读取并解析txt文档数据
    :param file_name:
    :param num_per_line:每行数据个数
    :return:
    """
    with open(file_name) as file_object:
        # line = file_object.readline()  # 读取一行;指针自动下移
        lines = file_object.readlines()  # 读取每一行存在一个列表中
 
    data = []
    for line in lines:
        line = line.replace(',', '')
        data_line = line.strip('\n').split()  # 去除首尾换行符，并按空格划分
        if len(data_line) != num_per_line :  # if data_line == []:
            continue
        else:
            data.append(data_line[0])
 
    return data


def checkOpInfo(ops):
    # remove duplicate types
    opsType = list(set([op.type for op in ops]))
    dirname, filename = os.path.split(os.path.abspath(__file__))
    opsPath = os.path.join(dirname, 'ops.txt')
    # read ops txt
    opsSupportList = read_txt_data(opsPath)
    for type in opsType:
        if type not in opsSupportList:
            notSupportOps.append(type)


def checkTensorTextureShape(feed_target_names, fetch_targets):
    # 获取输入shape
    feedData = {}
    feeded_vars = [program.global_block().vars[varname] for varname in feed_target_names]
    for feedItem in feeded_vars:
        curShape = feedItem.shape
        feedName = feedItem.name
        feedData[feedName] = np.full(excludeNegativeShape(curShape), 1.0, "float32")

    for v in program.list_vars():
        if not v.persistable:
            v.persistable = True
    exe.run(program, feed=feedData, fetch_list=fetch_targets, return_numpy=False)

    vars = list(program.list_vars())
    for v in vars:
        if "feed" == v.name:
            continue
        if "fetch" == v.name:
            continue
        var = fluid.global_scope().find_var(v.name)
        varData = np.array(var.get_tensor())
        varShape = list(varData.shape)
        textureShape = getTextureShapefromLogicalShape(varShape)
        getExceedMaxShape(textureShape, v.name)


def checkPaddleModel(modelDir, modelName, paramsName):
    #In PaddlePaddle 2.x, we turn on dynamic graph mode by default, and 'load_inference_model()' is only supported in static graph mode. So  call 'paddle.enable_static()' before this api to enter static graph mode.
    paddle.enable_static()
    # 初始化fluid运行环境和配置
    global exe
    exe = fluid.Executor(fluid.CPUPlace())
    result = fluid.io.load_inference_model(dirname=modelDir, executor=exe, model_filename=modelName, params_filename=paramsName)
    global program
    program = result[0]
    feed_target_names = result[1]
    fetch_targets = result[2]
    ops = program.current_block().ops

    # check ops support
    checkOpInfo(ops)
    # check tensor shape limit
    checkTensorTextureShape(feed_target_names, fetch_targets)

    if len(notSupportOps) > 0:
        print("\033[31mModel has unsupported op !\033[0m")
        print(notSupportOps)
    else:
        print("\033[32mAll ops are supported.\033[0m")


    if len(pcExceed) > 0:
        print("\033[31mModel has "  + str(len(pcExceed)) + " tensors exceed PC WebGL MAX_TEXTURE_SIZE 16384 * 8 !\033[0m")
        print(pcExceed)
    else:
        print("\033[32mModel can run in PC WebGL successfully.\033[0m")

    if len(wiseExceed) > 0:
        print("\033[31mModel has "  + str(len(wiseExceed)) + " tensors exceed WISE WebGL MAX_TEXTURE_SIZE 4096 * 8 !\033[0m")
        print(wiseExceed)
    else:
        print("\033[32mModel can run in WISE WebGL successfully.\033[0m")


def main():

    global sliceDataSize
    global enableLogModelInfo

    try:
        p = argparse.ArgumentParser(description='模型转换参数解析')
        p.add_argument('--modelPath', help='fluid模型文件所在路径，使用合并参数文件时使用该参数', required=False)
        p.add_argument("--logModelInfo", type=int, default=0, help='是否输出模型结构信息，非必要参数，0为不输出，1为输出，默认不输出', required=False)
        p.add_argument('--paramPath', help='fluid参数文件所在路径，使用合并参数文件时使用该参数', required=False)

        args = p.parse_args()
        modelPath = args.modelPath
        paramPath = args.paramPath
        modelDir, modelName = os.path.split(modelPath)
        paramDir, paramsName = os.path.split(paramPath)
        if paramDir != modelDir:
            print("\033[31mModel and param file should be put in a same directory!\033[0m")
            raise Exception()

        if args.logModelInfo == 1:
            enableLogModelInfo = True

        checkPaddleModel(modelDir, modelName, paramsName)

    except Exception as identifier:
        print("\033[31mA fetal error occured. Failed to convert model.\033[0m")
        print(traceback.format_exc())
        pass



if __name__ == "__main__":
    main()