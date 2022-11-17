[中文版](./README_cn.md)

# Paddle.js

<p >
<img src="https://travis-ci.org/PaddlePaddle/Paddle.js.svg?branch=master" alt="building"> <img src="https://github.com/paddlepaddle/paddle.js/actions/workflows/ut.yml/badge.svg" alt="UnitTest"> <img src="https://img.shields.io/github/commit-activity/m/paddlepaddle/paddle.js/master?color=important" alt="commit-activity"> <img src="https://img.shields.io/github/license/paddlepaddle/paddle.js" alt="license"> <img src="https://img.shields.io/github/package-json/v/paddlepaddle/paddle.js/master?color=yellow" alt="license"> <img src="https://img.shields.io/github/v/release/paddlepaddle/paddle.js?color=skyblue" alt="license"> <img src="https://img.shields.io/pypi/pyversions/paddlejsconverter" alt="python">
</p>

Paddle.js is a web project for Baidu PaddlePaddle, which is an open source deep learning framework running in the browser. Paddle.js can either load a pre-trained model, or transforming a model from paddle-hub with model transforming tools provided by Paddle.js. It could run in every browser with WebGL/WebGPU/WebAssembly supported. It could also run in Baidu Smartprogram and WX miniprogram.

## Ecosystem

| Project                  | version                | Description         |
| ------------------------ | ---------------------- | --------------------|
| [paddlejs-core]          | [![paddlejs-core-status]][paddlejs-core-package] | inference engine  |
| [paddlejs-backend-webgl] | [![paddlejs-backend-webgl-status]][paddlejs-backend-webgl-package] | webgl backend |
| [paddlejs-backend-wasm] | [![paddlejs-backend-wasm-status]][paddlejs-backend-wasm-package] | wasm backend |
| [paddlejs-backend-webgpu] | [![paddlejs-backend-webgpu-status]][paddlejs-backend-webgpu-package] | webgpu backend |
| [paddlejsconverter]      | [![paddlejsconverter-status]][paddlejsconverter-package] | convert paddlepaddle model |
| [humanseg]      | [![humanseg-status]][humanseg-package] | human segmentation library |
| [ocr]      | [![ocr-status]][ocr-package] | optical character recognition library |
| [gesture]      | [![gesture-status]][gesture-package] | gesture recognition library |
| [mobilenet]      | [![mobilenet-status]][mobilenet-package] | image classification library |
| [ocr detection]      | [![ocr-detection-status]][ocr-detection-package] | optical character detection library |
| [facedetect]      | [![facedetect-status]][facedetect-package] | face detection library |

[paddlejs-core]: ./packages/paddlejs-core/README.md
[paddlejs-core-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-core
[paddlejs-core-package]: https://npmjs.com/package/@paddlejs/paddlejs-core

[paddlejs-backend-webgl]: ./packages/paddlejs-backend-webgl/README.md
[paddlejs-backend-webgl-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-webgl
[paddlejs-backend-webgl-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-webgl

[paddlejs-backend-wasm]: ./packages/paddlejs-backend-wasm/README.md
[paddlejs-backend-wasm-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-wasm
[paddlejs-backend-wasm-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-wasm

[paddlejs-backend-webgpu]: ./packages/paddlejs-backend-webgpu/README.md
[paddlejs-backend-webgpu-status]: https://img.shields.io/npm/v/@paddlejs/paddlejs-backend-webgpu
[paddlejs-backend-webgpu-package]: https://npmjs.com/package/@paddlejs/paddlejs-backend-webgpu

[paddlejsconverter]: ./packages/paddlejs-converter/README.md
[paddlejsconverter-status]: https://img.shields.io/pypi/v/paddlejsconverter
[paddlejsconverter-package]: https://pypi.org/project/paddlejsconverter/

[humanseg]: ./packages/paddlejs-models/humanseg/README.md
[humanseg-status]: https://img.shields.io/npm/v/@paddlejs-models/humanseg
[humanseg-package]: https://npmjs.com/package/@paddlejs-models/humanseg

[ocr]: ./packages/paddlejs-models/ocr/README.md
[ocr-status]: https://img.shields.io/npm/v/@paddlejs-models/ocr
[ocr-package]: https://npmjs.com/package/@paddlejs-models/ocr

[gesture]: ./packages/paddlejs-models/gesture/README.md
[gesture-status]: https://img.shields.io/npm/v/@paddlejs-models/gesture
[gesture-package]: https://npmjs.com/package/@paddlejs-models/gesture

[mobilenet]: ./packages/paddlejs-models/mobilenet/README.md
[mobilenet-status]: https://img.shields.io/npm/v/@paddlejs-models/mobilenet
[mobilenet-package]: https://npmjs.com/package/@paddlejs-models/mobilenet

[ocr detection]: ./packages/paddlejs-models/ocrdetection/README.md
[ocr-detection-status]: https://img.shields.io/npm/v/@paddlejs-models/ocrdet
[ocr-detection-package]: https://npmjs.com/package/@paddlejs-models/ocrdet


[facedetect]: ./packages/paddlejs-models/facedetect/README.md
[facedetect-status]: https://img.shields.io/npm/v/@paddlejs-models/facedetect
[facedetect-package]: https://npmjs.com/package/@paddlejs-models/facedetect

## Website
https://paddlejs.baidu.com

## Key Features

### Module

* [paddlejs-core](./packages/paddlejs-core/README.md), the core part of the Paddle.js ecosystem, which is responsible for the operation of the inference process of the entire engine. 
 <img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-core" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-core?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-core" alt="downloads">
* [paddlejsconverter](./packages/paddlejs-converter/README.md), model transformation tool for Paddle.js, convert PaddlePaddle models (also known as fluid models) into a browser-friendly format.
* [paddlejs-models](./packages/paddlejs-models/), model projects, supply flexible low-level APIs for users to implement their AI scenario. 
* [paddlejs-examples](./packages/paddlejs-examples/), Paddle.js AI examples
* [paddlejs-mediapipe](./packages/paddlejs-mediapipe/), tools for live and streaming media, support webrtc camera and a lightweight opencv package
### Backends
* [paddlejs-backend-webgl](./packages/paddlejs-backend-webgl/README.md), webgl backend, the main backend for Paddle.js, [ops supported](./packages/paddlejs-backend-webgl/src/ops/index.ts)
<img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-backend-webgl" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-backend-webgl?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-backend-webgl" alt="downloads">
* [paddlejs-backend-webgpu](./packages/paddlejs-backend-webgpu/README.md), webgpu backend, an experimental backend, [WebGPU draft](https://gpuweb.github.io/gpuweb/), [ops supported](./packages/paddlejs-backend-webgpu/src/ops/index.ts)
* [paddlejs-backend-wasm](./packages/paddlejs-backend-wasm/README_cn.md), WebAssembly backend, [ops supported](./packages/paddlejs-backend-wasm/src/ops.ts)
* [paddlejs-backend-cpu](./packages/paddlejs-backend-cpu/README.md), cpu backend, [ops supported](./packages/paddlejs-backend-cpu/src/ops/index.ts)
* [paddlejs-backend-nodegl](./packages/paddlejs-backend-nodegl/README.md), nodegl backend, a backend in Node.js for Paddle.js, using the webgl backend ops. [ops supported](./packages/paddlejs-backend-webgl/src/ops/index.ts)


## Examples
- [image classification game](./packages/paddlejs-examples/clasGame/README.md) image classification game example in wx miniprogram
- [gesture](./packages/paddlejs-examples/gesture/README.md) gesture recognition example [online experience](https://paddlejs.baidu.com/gesture)
- [humanStream](./packages/paddlejs-examples/humanStream/README.md) video-streaming human segmentation [online experience](https://paddlejs.baidu.com/humanStream)
- [humanseg](./packages/paddlejs-examples/humanseg/README.md) human segmentation example [online experience](https://paddlejs.baidu.com/humanseg)
- [ocr](./packages/paddlejs-examples/ocr/README.md) optical character recognition example [online experience](https://paddlejs.baidu.com/ocr)
- [ocr detection](./packages/paddlejs-examples/ocrdetection/README.md) optical character detection example [online experience](https://paddlejs.baidu.com/ocrdet)
- [mobilenet](./packages/paddlejs-examples/mobilenet) classify images into 1000 object categories [online experience](https://paddlejs.baidu.com/mobilenet)
- [wine](./packages/paddlejs-examples/wine) classify bottles into 7 categories [online experience](https://paddlejs.baidu.com/wine)
- [webglworker](./packages/paddlejs-examples/webglWorker) This demo help us to use Paddle.js in WebWorker.

<p>
  <a target="_blank" href="./packages/paddlejs-examples/clasGame/README.md">
    <img alt="clasGame" src="./packages/paddlejs-examples/clasGame/exampleImage/demo1.gif" style="width: 100%">
  </a><a target="_blank" href="./packages/paddlejs-examples/wine/README.md">
    <img alt="wine" src="https://user-images.githubusercontent.com/43414102/156372713-d07e190f-bdb6-433e-a5cd-866fffbbb5d6.gif" style="width: 100%">
  </a><a target="_blank" href="./packages/paddlejs-examples/gesture/README.md">
    <img alt="gesture" src="https://user-images.githubusercontent.com/43414102/156379706-065a4f57-cc75-4457-857a-18619589492f.gif" style="width: 100%">
  </a><a target="_blank" href="./packages/paddlejs-examples/ocr/README.md">
    <img alt="ocr" src="https://user-images.githubusercontent.com/43414102/156380942-2ee5ad8d-d023-4cd3-872c-b18ebdcbb3f3.gif" style="width: 100%">
  </a>
</p>
<p>
  <a target="_blank" href="./packages/paddlejs-examples/humanseg/README.md">
    <img alt="humanseg" src="https://user-images.githubusercontent.com/43414102/156384741-83f42d25-7062-49e1-9106-677bbbefbcfb.jpg" style="width: 40%">
  </a><a target="_blank" href="./packages/paddlejs-models/facedetect/README.md">
    <img alt="facedetect" src="https://user-images.githubusercontent.com/43414102/156384732-cb053df6-826e-42d7-92ba-536ab67011c4.jpg" style="width: 40%">
  </a>
</p>


### Browser/Platforms Coverage

* PC: Chrome, Safari, Firefox
* Phone: Baidu App , Chrome , UC and QQ Browser
* Smartprogram: Baidu Smartprogram, WX miniprogram
* Platform: macOS, Windows



## Load Model

1. Support load model files on the network:

 - model.json (model structure and operators' attributes)
 - chunk_x.dat (model params binary data)

2. Support use model obj
 - modelObj.model (model structure json object)
 - modelObj.params（model params Float32Array data）

If you dont' want to put model on the network, you can use method 2.


## Feedback and Community Support
- Online video tutorial [start video](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- Questions, reports, and suggestions are welcome through Github Issues!
- Forum: Opinions and questions are welcome at our [PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)！
- QQ group chat: 696965088
