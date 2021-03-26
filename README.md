[中文版](./README_cn.md)

# Paddle.js

Paddle.js is a web project for Baidu PaddlePaddle, which is an open source deep learning framework running in the browser. Paddle.js can either load a pre-trained model, or transforming a model from paddle-hub with model transforming tools provided by Paddle.js. It could run in every browser with WebGL/WebGPU supported.

[![Build Status](https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=beta)](https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=beta)

## Key Features

### Module

* [paddlejs-core](./packages/paddlejs-core/README.md), the core part of the Paddle.js ecosystem, which is responsible for the operation of the inference process of the entire engine.
* [paddlejs-converter](./packages/paddlejs-converter/README.md), model transformation tool for Paddle.js, convert PaddlePaddle models (also known as fluid models) into a browser-friendly format.
* [paddlejs-models](./packages/paddlejs-models/), model projects, supply flexible low-level APIs for users to implement their AI scenario.
* [paddlejs-examples](./packages/paddlejs-examples/), Paddle.js AI examples
* [paddlejs-mediapipe](./packages/paddlejs-mediapipe/), tools for live and streaming media, support webrtc camera and a lightweight opencv package
### Backends
* [paddlejs-backend-webgl](./packages/paddlejs-backend-webgl/README.md), webgl backend, the main backend for Paddle.js, [ops supported](./packages/paddlejs-backend-webgl/src/ops/index.ts)
* [paddlejs-backend-webgpu](./packages/paddlejs-backend-webgpu/README.md)，webgpu backend, an experimental backend, [WebGPU draft](https://gpuweb.github.io/gpuweb/), [ops supported](./packages/paddlejs-backend-webgpu/src/ops/index.ts)
* [paddlejs-backend-cpu](./packages/paddlejs-backend-cpu/README.md), cpu backend, [ops supported](./packages/paddlejs-backend-cpu/src/ops/index.ts)
* [paddlejs-backend-nodegl](./packages/paddlejs-backend-nodegl/README.md), nodegl backend, a backend in Node.js for Paddle.js, using the webgl backend ops. [ops supported](./packages/paddlejs-backend-webgl/src/ops/index.ts)

### Browser/Platforms Coverage

* PC: Chrome, Safari, Firefox
* Phone: Baidu App , Chrome , UC and QQ Browser
* Smartprogram: Baidu Smartprogram, WX Smartprogram
* Platform: macOS, Windows



## Web-friendly format

The conversion script above produces 2 types of files:

 - model.json (the dataflow graph and weight manifest file)
 - chunk_x.dat (collection of binary weight files)


## Feedback and Community Support
- Online video tutorial [start video](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- Questions, reports, and suggestions are welcome through Github Issues!
- Forum: Opinions and questions are welcome at our [PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)！
- QQ group chat: 696965088
