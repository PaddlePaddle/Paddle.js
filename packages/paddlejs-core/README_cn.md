[English](./README.md)

# Paddle.js Core

是 Paddle.js 推理引擎的核心部分，npm 包名是 `@paddlejs/paddlejs-core`，负责整个引擎的推理流程运行，提供计算方案注册、环境变量注册的接口。

## 安装
使用 npm 安装，`@paddlejs/paddlejs-core`

```js
// Import @paddlejs/paddlejs-core
import { Runner } from '@paddlejs/paddlejs-core';
// Import the registered WebGL backend.
import '@paddlejs/paddlejs-backend-webgl';

const runner = new Runner({
    modelPath: '/model/mobilenetv2', // model path, e.g. http://xx.cc/path, http://xx.cc/path/model.json, /localModelDir/model.json, /localModelDir
    fileCount?: 4, // model data file count, default value is 1
    feedShape: { // input shape
        fw: 256,
        fh: 256
    },
    fill?: '#fff' // fill color when resize image, default value is #fff
});

// init runner
await runner.init();
// predict and get result
const res = await runner.predict(mediadata, callback?);
```

**Note**: 如果你引入 paddlejs-core，你仍需引入一个计算方案。(目前我们提供两种方案, webgpu 目前还是实验阶段，需要使用 chrome canary 访问，
[paddlejs-backend-webgl](/packages/paddlejs-backend-webgl), [paddlejs-backend-webgpu](/packages/paddlejs-backend-webgpu)).
