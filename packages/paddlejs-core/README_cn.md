[English](./README.md)

# Paddle.js Core

是 Paddle.js 推理引擎的核心部分，npm 包名是 `@paddlejs/paddlejs-core`，负责整个引擎的推理流程运行，提供计算方案注册、环境变量注册的接口。

<img src="https://img.shields.io/npm/v/@paddlejs/paddlejs-core?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-core" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-core?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-core" alt="downloads">

## 引擎配置 RunnerConfig
注册引擎时需要对引擎进行配置，必须配置项为 `modelPath`、`feedShape`，所有项目配置如下：

```typescript

// 模型网络图结构
enum GraphType {
    SingleOutput = 'single', // 单输出
    MultipleOutput = 'multiple', // 多输出
    MultipleInput = 'multipleInput' // 多输入
}

interface RunnerConfig {
    modelPath: string; // 模型路径（本地路径或者网络地址）
    modelName?: string; // 模型名称
    feedShape: { // 模型输入 feed shape
        fc?: number; // 通道，默认为 3
        fw: number; // 宽
        fh: number; // 高
    };
    fill?: string; // 缩放后用什么颜色填充不足方形部分
    mean?: number[]; // 平均值
    std?: number[]; // 标准差
    bgr?: boolean; // 图片通道排列是否是 BGR，默认为 false，为主流 RGB
    type?: GraphType; // 模型网络图结构，默认单输入单输出
    needPreheat?: boolean; // 是否在引擎初始化时进行预热，默认为 true
    plugins?: { // 注册模型拓扑结构转换插件
        preTransforms?: Transformer[]; // 在创建网络拓扑前进行转换
        transforms?: Transformer[]; // 在遍历模型层时进行转换
        postTransforms?: Transformer[]; // 创建网络拓扑图完成后进行转换
    };
}

```

## 安装和使用
使用 npm 安装，`@paddlejs/paddlejs-core`

```js
// Import @paddlejs/paddlejs-core
import { Runner } from '@paddlejs/paddlejs-core';
// Import the registered WebGL backend.
import '@paddlejs/paddlejs-backend-webgl';

const runner = new Runner({
    modelPath: '/model/mobilenetv2', // model path, e.g. http://xx.cc/path, http://xx.cc/path/model.json, /localModelDir/model.json, /localModelDir
    feedShape: { // input shape
        fw: 256,
        fh: 256
    },
    fill?: '#fff', // fill color when resize image, default value is #fff
    webglFeedProcess?: true  // 开启 `webglFeedProcess`，将模型前处理部分全部转换为 shader GPU 处理，并保留原始图片 texture
    ```

});

// init runner
await runner.init();
// predict and get result
const res = await runner.predict(mediadata, callback?);
```

**Note**: 如果你引入 paddlejs-core，你仍需引入一个计算方案。(目前我们提供两种方案, webgpu 目前还是实验阶段，需要使用 chrome canary 访问，
[paddlejs-backend-webgl](/packages/paddlejs-backend-webgl), [paddlejs-backend-webgpu](/packages/paddlejs-backend-webgpu)).



## 高阶使用

1. `@paddlejs/paddlejs-core` 提供接口 `registerOp`，开发者可以通过该接口，完成自定义算子注册。

2. `@paddlejs/paddlejs-core` 提供全局变量 `env` 模块，开发者可以通过该模块完成环境变量注册，使用方法如下：

    ```js
    // set env key/flag and value
    env.set(key, value);

    // get value by key/flag
    env.get(key);
    ```

3. 改变模型结构

    通过 `runnerConfig.plugins` 注册模型转换器，开发者可以对模型结构进行改变（增、删、改），比如通过剪枝去除不必要的模型层来加快推理，也可以将自定义层加入模型最后，将后处理变为模型中的层来加速后处理。


4. 开启性能 flag 实现加速

    目前 Paddle.js 提供五个性能相关 `flag`，如需开启推理加速，可以将相关 `flag` 置 `true`。


    #### 开启 `webgl_pack_channel`，合适的 conv2d 会使用 packing shader 进行排布变换，通过向量化计算来提高性能。

    ```js
    env.set('webgl_pack_channel', true);
    ```

    #### 开启 `webgl_force_half_float_texture`，feature map 使用半浮点 `HALF_FLOAT`

    ```js
    env.set('webgl_force_half_float_texture', true);
    ```

    #### 开启 `webgl_gpu_pipeline`，将模型前处理部分全部转换为 shader GPU 处理，且将模型推理结果上屏渲染到 webgl backend 的  `WebGL2RenderingContext` 上。开发者可对输出结果 texture 和原始图片 texture 进行模型后处理，来实现 GPU 全流程：前处理+推理+后处理（渲染处理），获得高性能，可参考 humanseg model 案例。

    ```js
    env.set('webgl_gpu_pipeline', true);
    ```

    #### 开启 `webgl_pack_output`，将模型输出结果 `NHWC` 到 `NCHW` 排布变换迁移至 GPU 进行，并 `pack` 为四通道排布，从 GPU 读取结果时，可以减少循环处理

    ```js
    env.set('webgl_pack_output', true);
    ```