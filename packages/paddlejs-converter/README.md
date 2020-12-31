[中文版](./README_cn.md)
# paddlejs-converter

paddlejs-converter is a model transformation tool suitable for paddlejs. Its function is to convert paddlepadle model (or fluid model) to Paddle.js model. This browser friendly format is used for loading to predict in browser and other environments by Paddle.js. In addition, paddlejs-converter also provides powerful model optimization capabilities to help developers optimize model structure and improve runtime performance.

## 1. Tutorial

### 1.1. Environment Construction
#### Python Version
Confirm whether the python environment and version of the running platform meet the requirements. If Python 3 is used, you may need to change the `python3` in subsequent commands to `python3`:
- Python3： 3.5.1+ / 3.6 / 3.7
- Python2： 2.7.15+

#### Install Virtual Environment
*Since the development environment may have multiple versions of Python installed, there may be different versions of dependent packages. In order to avoid conflicts, it is strongly recommended to use Python virtual environment to execute the commands required by the conversion tool to avoid various problems. If you are not using a virtual environment or if you have a virtual environment installed, you can skip this step.*

Take Anaconda as an example：
Go to [Anaconda](https://www.anaconda.com/) main page，Select the corresponding platform and python version of anaconda and install it according to the official prompts；

After installation, execute the following command on the command line to create a python virtual environment:
``` bash
conda create --name <your_env_name>
```

Execute the following command to switch to the virtual environment
``` bash
# Linux or macOS
source activate <your_env_name>

# Windows
activate <your_env_name>
```

#### Installation Dependency
- 如果`不需要`使用优化模型的能力，执行命令：
``` bash
python -m pip install paddlepaddle -i https://mirror.baidu.com/pypi/simple
```
- 如果`需要`使用优化模型的能力，执行命令：
``` bash
python -m pip install paddlepaddle paddlelite==2.6.0 -i https://mirror.baidu.com/pypi/simple
```

### 1.2. Get Start
- 如果待转换的 fluid 模型为`合并参数文件`，即一个模型对应一个参数文件：
``` bash
python convertToPaddleJSModel.py --modelPath=<fluid_model_file_path> --paramPath=<fluid_param_file_path> --outputDir=<paddlejs_model_directory>
```
- 如果待转换的 fluid 模型为`分片参数文件`，即一个模型文件对应多个参数文件：
``` bash
# 注意，使用这种方式调用转换器，需要保证 inputDir 中，模型文件名为'__model__'
python convertToPaddleJSModel.py --inputDir=<fluid_model_directory> --outputDir=<paddlejs_model_directory>
````
模型转换器将生成以下两种类型的文件以供 Paddle.js 使用：

- model.json (模型结构与参数清单)
- chunk_\*.dat (二进制参数文件集合)

## 2. Detailed Documentation

参数 |  描述
:-: | :-:
--inputDir | fluid 模型所在目录，当且仅当使用分片参数文件时使用该参数，将忽略 `modelPath` 和 `paramPath` 参数，且模型文件名必须为`__model__`
--modelPath | fluid 模型文件所在路径，使用合并参数文件时使用该参数
--paramPath | fluid 参数文件所在路径，使用合并参数文件时使用该参数
--outputDir | `必要参数`， paddleJS 模型输出路径
--optimize | 是否进行模型优化， `0` 为关闭优化，`1` 为开启优化（需安装 PaddleLite ），默认关闭优化
--logModelInfo | 是否打印模型结构信息， `0` 为不打印， `1` 为打印，默认不打印
--sliceDataSize | 分片输出 Paddle.js 参数文件时，每片文件的大小，单位：KB，默认 4096

## 3. Other information
若需要转换的模型为 `TensorFlow/Caffe/ONNX` 格式，可使用 PaddlePaddle 项目下的 `X2Paddle`工具，将其他格式的模型转为 fluid 模型后，再使用本工具转化为 Paddle.js 模型。
详细请参考 [X2Paddle 项目](https://github.com/PaddlePaddle/X2Paddle)
