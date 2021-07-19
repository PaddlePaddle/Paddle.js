# 安装依赖

## 1、Python 环境

### Python 版本确认

确认运行平台的 Python 环境与版本是否满足要求，若使用 Python3 ，则可能需要将后续命令中的 `python` 换成 `python3`：
- Python3： 3.5.1+ / 3.6 / 3.7
- Python2： 2.7.15+

Python下载：https://www.python.org/downloads/

### 安装虚拟环境
*由于开发环境可能安装了多个版本的 Python，相关依赖包可能存在不同的版本，为避免产生冲突，**强烈建议**使用 Python 虚拟环境执行转换工具所需的各项命令，以免产生各种问题。若不使用虚拟环境或已安装虚拟环境，可跳过该步骤。*

以 Anaconda 为例：
前往 [Anaconda](https://www.anaconda.com/) 主页，选择对应平台、Python 版本的 Anaconda 按照官方提示，进行安装；

安装完毕后，在命令行执行以下命令，创建Python 虚拟环境：
``` bash
conda create --name <your_env_name>
```

执行以下命令，切换至虚拟环境
``` bash
# Linux 或 macOS下请执行
source activate <your_env_name>

# Windows 下请执行
activate <your_env_name>
```

## 2、paddlepaddle 安装

- 如果`不需要`使用优化模型的能力，执行命令：
``` bash
python -m pip install paddlepaddle -i https://mirror.baidu.com/pypi/simple
```
- 如果`需要`使用优化模型的能力，执行命令：
``` bash
python -m pip install paddlepaddle paddlelite==2.6.1 -i https://mirror.baidu.com/pypi/simple
```

## 3、paddle.js 环境

- Node 版本 >= 10.13.0

Node 下载：http://nodejs.cn/download/

Node 安装配置：https://www.runoob.com/nodejs/nodejs-install-setup.html

- paddle.js 源码下载：https://github.com/PaddlePaddle/Paddle.js.git

- 安装项目依赖，执行命令：
``` bash
npm run init
```
命令执行成功后，项目依赖安装完成。

