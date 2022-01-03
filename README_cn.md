[English](./README.md)

# Paddle.js

Paddle.js 是百度 PaddlePaddle 的 web 方向子项目，是一个运行在浏览器中的开源深度学习框架。Paddle.js 可以加载提前训练好的 paddle 模型，或者将 paddle hub 中的模型通过 Paddle.js 的模型转换工具 paddlejs-converter 变成浏览器友好的模型进行在线推理预测使用。目前，Paddle.js 可以在支持 WebGL/WebGPU/WebAssembly 的浏览器中运行，也可以在百度小程序和微信小程序环境下运行。

[![Build Status](https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=beta)](https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=beta)


## 主要特点

### 模块

* [paddlejs-core](./packages/paddlejs-core/README_cn.md)，推理引擎的核心部分，负责整个引擎的推理流程运行
* [paddlejs-converter](./packages/paddlejs-converter/README_cn.md)，模型转换工具，将 PaddlePaddle 模型（或称为 fluid 模型）转化为浏览器友好的格式
* [paddlejs-models](./packages/paddlejs-models/)，封装好的模型工程库，提供简易 api 方便用户落地 AI 效果
* [paddlejs-examples](./packages/paddlejs-examples/)，Paddle.js AI 效果样例
* [paddlejs-mediapipe](./packages/paddlejs-mediapipe/)，数据流处理工具库，支持 webrtc 视频流、轻量 opencv 等工具

### 计算方案
* [paddlejs-backend-webgl](./packages/paddlejs-backend-webgl/README_cn.md)，webgl 方案，目前算子支持最多的方案，[算子支持列表](./packages/paddlejs-backend-webgl/src/ops/index.ts)
* [paddlejs-backend-webgpu](./packages/paddlejs-backend-webgpu/README_cn.md)，webgpu 方案，该计算方案仍然是实验阶段，[**WebGPU** 仍处于草案阶段](https://gpuweb.github.io/gpuweb/) ，[算子支持列表](./packages/paddlejs-backend-webgpu/src/ops/index.ts)
* [paddlejs-backend-wasm](./packages/paddlejs-backend-wasm/README_cn.md)，WebAssembly 方案，[算子支持列表](./packages/paddlejs-backend-wasm/src/ops.ts)
* [paddlejs-backend-cpu](./packages/paddlejs-backend-cpu/README_cn.md)，cpu 方案，[算子支持列表](./packages/paddlejs-backend-cpu/src/ops/index.ts)
* [paddlejs-backend-nodegl](./packages/paddlejs-backend-nodegl/README_cn.md), nodegl 方案, 在 Node.js 环境中执行预测, 使用 webgl 方案的算子 [算子支持列表](./packages/paddlejs-backend-webgl/src/ops/index.ts)
### 浏览器/系统覆盖范围

* PC浏览器: Chrome、Safari、Firefox
* 手机浏览器: Baidu App、Safari、Chrome、UC and QQ Browser
* 小程序: 百度小程序、微信小程序
* 系统: MacOS、Windows


## 加载模型

1. 支持加载网络模型文件和权重文件：

 - model.json (模型结构和算子属性)
 - chunk_x.dat (模型参数二进制数据文件)

2. 支持加载模型对象
 - modelObj.model (模型结构 json 对象)
 - modelObj.params（模型参数，类型 Float32Array）

如果不想将模型放入网络时，可以使用方式二，直接将模型对象传入

## 模型库
- [gesture model](./packages/paddlejs-models/gesture/README.md) 手势识别库
- [mobilenet model](./packages/paddlejs-models/mobilenet/README.md) 物品分类库，可以上传自己的分类模型和分类
- [humanseg model](./packages/paddlejs-models/humanseg/README.md) 人像分割库
- [ocr model](./packages/paddlejs-models/ocr/README.md) optical 文字识别库
- [ocr detection model](./packages/paddlejs-models/ocrdetection/README.md) 文本检测库

## Examples
- [image classification game](./packages/paddlejs-examples/clasGame/README.md) 物品识别微信小程序——寻物小游戏
- [gesture](./packages/paddlejs-examples/gesture/README.md) 手势识别 demo
- [humanStream](./packages/paddlejs-examples/humanStream/README.md) 基于视频流的人像分割 demo
- [humanseg](./packages/paddlejs-examples/humanseg/README.md) 人像分割 demo
- [ocr](./packages/paddlejs-examples/ocr/README.md) 文本识别 demo
- [ocr detection](./packages/paddlejs-examples/ocrdetection/README.md) 文本检测 demo
- [mobilenet](./packages/paddlejs-examples/mobilenet) 1000 物品分类 demo
- [wine](./packages/paddlejs-examples/wine) 酒瓶识别 demo

## 反馈和社区支持
- 在线视频课程 [开始学习](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- 欢迎在Github Issue中提出问题，反馈和建议！
- 欢迎在我们的[PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)提出观点，进行讨论！
- QQ群：696965088
