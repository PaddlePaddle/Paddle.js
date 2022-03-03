[English](./README.md)

# Paddle.js

<p >
<img src="https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=master" alt="building"> <img src="https://github.com/paddlepaddle/paddle.js/actions/workflows/ut.yml/badge.svg" alt="UnitTest"> <img src="https://img.shields.io/github/commit-activity/m/paddlepaddle/paddle.js/master?color=important" alt="commit-activity"> <img src="https://img.shields.io/github/license/paddlepaddle/paddle.js" alt="license"> <img src="https://img.shields.io/github/package-json/v/paddlepaddle/paddle.js/master?color=yellow" alt="license"> <img src="https://img.shields.io/github/v/release/paddlepaddle/paddle.js?color=skyblue" alt="license"> <img src="https://img.shields.io/pypi/pyversions/paddlejsconverter" alt="python">
</p>

Paddle.js 是百度 PaddlePaddle 的 web 方向子项目，是一个运行在浏览器中的开源深度学习框架。Paddle.js 可以加载提前训练好的 paddle 模型，或者将 paddle hub 中的模型通过 Paddle.js 的模型转换工具 paddlejs-converter 变成浏览器友好的模型进行在线推理预测使用。目前，Paddle.js 可以在支持 WebGL/WebGPU/WebAssembly 的浏览器中运行，也可以在百度小程序和微信小程序环境下运行。

## 生态

| 项目                  | 版本                | 描述         |
| ------------------------ | ---------------------- | --------------------|
| [paddlejs-core]          | [![paddlejs-core-status]][paddlejs-core-package] | 推理引擎  |
| [paddlejs-backend-webgl] | [![paddlejs-backend-webgl-status]][paddlejs-backend-webgl-package] | webgl 计算方案 |
| [paddlejs-backend-wasm] | [![paddlejs-backend-wasm-status]][paddlejs-backend-wasm-package] | wasm 计算方案 |
| [paddlejs-backend-webgpu] | [![paddlejs-backend-webgpu-status]][paddlejs-backend-webgpu-package] | webgpu 计算方案（实验版本） |
| [paddlejsconverter]      | [![paddlejsconverter-status]][paddlejsconverter-package] | 转换 paddlepaddle 模型 |
| [humanseg]      | [![humanseg-status]][humanseg-package] | 人像分割模型 sdk |
| [ocr]      | [![ocr-status]][ocr-package] | 文字识别模型 sdk |
| [gesture]      | [![gesture-status]][gesture-package] | 手势识别模型 sdk |
| [mobilenet]      | [![mobilenet-status]][mobilenet-package] | 图片分类模型 sdk |
| [ocr detection]      | [![ocr-detection-status]][ocr-detection-package] | 文本检测模型 sdk |
| [facedetect]      | [![facedetect-status]][facedetect-package] | 人脸识别模型 sdk |

[paddlejs-core]: ./packages/paddlejs-core/README_cn.md
[paddlejs-core-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-core
[paddlejs-core-package]: https://npmjs.com/package/@paddlejs/paddlejs-core

[paddlejs-backend-webgl]: ./packages/paddlejs-backend-webgl/README_cn.md
[paddlejs-backend-webgl-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-webgl
[paddlejs-backend-webgl-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-webgl

[paddlejs-backend-wasm]: ./packages/paddlejs-backend-wasm/README_cn.md
[paddlejs-backend-wasm-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-wasm
[paddlejs-backend-wasm-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-wasm

[paddlejs-backend-webgpu]: ./packages/paddlejs-backend-webgpu/README_cn.md
[paddlejs-backend-webgpu-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-webgpu
[paddlejs-backend-webgpu-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-webgpu

[paddlejsconverter]: ./packages/paddlejs-converter/README.md
[paddlejsconverter-status]: https://img.shields.io/pypi/v/paddlejsconverter
[paddlejsconverter-package]: https://pypi.org/project/paddlejsconverter/

[humanseg]: ./packages/paddlejs-models/humanseg/README_cn.md
[humanseg-status]: https://img.shields.io/npm/v/@paddlejs-models/humanseg
[humanseg-package]: https://npmjs.com/package/@paddlejs-models/humanseg

[ocr]: ./packages/paddlejs-models/ocr/README_cn.md
[ocr-status]: https://img.shields.io/npm/v/@paddlejs-models/ocr
[ocr-package]: https://npmjs.com/package/@paddlejs-models/ocr

[gesture]: ./packages/paddlejs-models/gesture/README_cn.md
[gesture-status]: https://img.shields.io/npm/v/@paddlejs-models/gesture
[gesture-package]: https://npmjs.com/package/@paddlejs-models/gesture

[mobilenet]: ./packages/paddlejs-models/mobilenet/README_cn.md
[mobilenet-status]: https://img.shields.io/npm/v/@paddlejs-models/mobilenet
[mobilenet-package]: https://npmjs.com/package/@paddlejs-models/mobilenet

[ocr detection]: ./packages/paddlejs-models/ocrdetection/README_cn.md
[ocr-detection-status]: https://img.shields.io/npm/v/@paddlejs-models/ocrdet
[ocr-detection-package]: https://npmjs.com/package/@paddlejs-models/ocrdet


[facedetect]: ./packages/paddlejs-models/facedetect/README_cn.md
[facedetect-status]: https://img.shields.io/npm/v/@paddlejs-models/facedetect
[facedetect-package]: https://npmjs.com/package/@paddlejs-models/facedetect

## 官网
https://paddlejs.baidu.com

## 主要特点

### 模块

* [paddlejs-core](./packages/paddlejs-core/README_cn.md)，推理引擎的核心部分，负责整个引擎的推理流程运行
<img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-core" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-core?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-core" alt="downloads">
* [paddlejs-converter](./packages/paddlejs-converter/README_cn.md)，模型转换工具，将 PaddlePaddle 模型（或称为 fluid 模型）转化为浏览器友好的格式
* [paddlejs-models](./packages/paddlejs-models/)，封装好的模型工程库，提供简易 api 方便用户落地 AI 效果
* [paddlejs-examples](./packages/paddlejs-examples/)，Paddle.js AI 效果样例
* [paddlejs-mediapipe](./packages/paddlejs-mediapipe/)，数据流处理工具库，支持 webrtc 视频流、轻量 opencv 等工具

### 计算方案
* [paddlejs-backend-webgl](./packages/paddlejs-backend-webgl/README_cn.md)，webgl 方案，目前算子支持最多的方案，[算子支持列表](./packages/paddlejs-backend-webgl/src/ops/index.ts)
<img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-backend-webgl" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-backend-webgl?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-backend-webgl" alt="downloads">
* [paddlejs-backend-webgpu](./packages/paddlejs-backend-webgpu/README_cn.md)，webgpu 方案，该计算方案仍然是实验阶段，[**WebGPU** 仍处于草案阶段](https://gpuweb.github.io/gpuweb/) ，[算子支持列表](./packages/paddlejs-backend-webgpu/src/ops/index.ts)
* [paddlejs-backend-wasm](./packages/paddlejs-backend-wasm/README_cn.md)，WebAssembly 方案，[算子支持列表](./packages/paddlejs-backend-wasm/src/ops.ts)
* [paddlejs-backend-cpu](./packages/paddlejs-backend-cpu/README_cn.md)，cpu 方案，[算子支持列表](./packages/paddlejs-backend-cpu/src/ops/index.ts)
* [paddlejs-backend-nodegl](./packages/paddlejs-backend-nodegl/README_cn.md), nodegl 方案, 在 Node.js 环境中执行预测, 使用 webgl 方案的算子 [算子支持列表](./packages/paddlejs-backend-webgl/src/ops/index.ts)

## 案例 demo
- [image classification game](./packages/paddlejs-examples/clasGame/README.md) 物品识别微信小程序——寻物小游戏
- [gesture](./packages/paddlejs-examples/gesture/README.md) 手势识别 demo [在线体验](https://paddlejs.baidu.com/gesture)
- [humanStream](./packages/paddlejs-examples/humanStream/README.md) 基于视频流的人像分割 demo [在线体验](https://paddlejs.baidu.com/humanStream)
- [humanseg](./packages/paddlejs-examples/humanseg/README.md) 人像分割 demo [在线体验](https://paddlejs.baidu.com/humanseg)
- [ocr](./packages/paddlejs-examples/ocr/README.md) 文本识别 demo [在线体验](https://paddlejs.baidu.com/ocr)
- [ocr detection](./packages/paddlejs-examples/ocrdetection/README.md) 文本检测 demo [在线体验](https://paddlejs.baidu.com/ocrdet)
- [mobilenet](./packages/paddlejs-examples/mobilenet) 1000 物品分类 demo [在线体验](https://paddlejs.baidu.com/mobilenet)
- [wine](./packages/paddlejs-examples/wine) 酒瓶识别 demo [在线体验](https://paddlejs.baidu.com/wine)
- [webglworker](./packages/paddlejs-examples/webglWorker) 如何在 Web Worker 中运行 Paddle.js

<p>
  <a target="_blank" href="./packages/paddlejs-examples/clasGame/README.md">
    <img alt="clasGame" src="./packages/paddlejs-examples/clasGame/exampleImage/demo1.gif" style="width: 20%">
  </a>
  <a target="_blank" href="./packages/paddlejs-examples/wine/README.md">
    <img alt="wine" src="https://user-images.githubusercontent.com/43414102/156372713-d07e190f-bdb6-433e-a5cd-866fffbbb5d6.gif" style="width: 20%">
  </a>
   <a target="_blank" href="./packages/paddlejs-examples/gesture/README.md">
    <img alt="gesture" src="https://user-images.githubusercontent.com/43414102/156379706-065a4f57-cc75-4457-857a-18619589492f.gif" style="width: 20%">
  </a>
</p>
<p>
  <a target="_blank" href="./packages/paddlejs-examples/ocr/README.md">
    <img alt="ocr" src="https://user-images.githubusercontent.com/43414102/156380942-2ee5ad8d-d023-4cd3-872c-b18ebdcbb3f3.gif" style="width: 60%">
  </a>
</p>
<p>
  <a target="_blank" href="./packages/paddlejs-examples/humanseg/README.md">
    <img alt="humanseg" src="https://user-images.githubusercontent.com/43414102/156384741-83f42d25-7062-49e1-9106-677bbbefbcfb.jpg" style="width: 32%">
  </a>
  <a target="_blank" href="./packages/paddlejs-models/facedetect/README.md">
    <img alt="facedetect" src="https://user-images.githubusercontent.com/43414102/156384732-cb053df6-826e-42d7-92ba-536ab67011c4.jpg" style="width: 28%">
  </a>
</p>

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

## 反馈和社区支持
- 在线视频课程 [开始学习](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- 欢迎在Github Issue中提出问题，反馈和建议！
- 欢迎在我们的[PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)提出观点，进行讨论！
- QQ群：696965088
