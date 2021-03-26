[English](./README.md)

# Paddle.js

Paddle.js 是百度 PaddlePaddle 的 web 方向子项目，是一个运行在浏览器中的开源深度学习框架。Paddle.js 可以加载提前训练好的 paddle 模型，或者将 paddle hub 中的模型通过 Paddle.js 的模型转换工具 paddlejs-converter 变成浏览器友好的模型进行在线推理预测使用。目前，Paddle.js 可以在支持 webGL/webGPU 的浏览器中运行。

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
* [paddlejs-backend-cpu](./packages/paddlejs-backend-cpu/README_cn.md)，cpu 方案，[算子支持列表](./packages/paddlejs-backend-cpu/src/ops/index.ts)
* [paddlejs-backend-nodegl](./packages/paddlejs-backend-nodegl/README_cn.md), nodegl 方案, 在 Node.js 环境中执行预测, 使用 webgl 方案的算子 [算子支持列表](./packages/paddlejs-backend-webgl/src/ops/index.ts)
### 浏览器/系统覆盖范围

* PC浏览器: Chrome、Safari、Firefox
* 手机浏览器: Baidu App、Safari、Chrome、UC and QQ Browser
* 小程序: 百度小程序、微信小程序
* 系统: MacOS、Windows


## Web友好的model格式

上面的转换脚本生成两种类型的文件：

 - model.json (数据流图和权重清单文件)
 - chunk_x.dat (二进制权重文件的集合)

## 反馈和社区支持
- 在线视频课程 [开始学习](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- 欢迎在Github Issue中提出问题，反馈和建议！
- 欢迎在我们的[PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)提出观点，进行讨论！
- QQ群：696965088
