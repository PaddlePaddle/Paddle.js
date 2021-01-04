# paddlejs-backend-webgpu

This package implements an experimental backend based on WebGPU for Paddle.js.
实现了 Paddle.js 的基于 WebGPU 计算方案，但该计算方案仍然是实验阶段，**WebGPU** 仍处于草案阶段 (https://gpuweb.github.io/gpuweb/)

## 安装

可以通过 npm 安装 `@paddlejs/paddlejs-backend-webgpu`


```js

// Import the WebGPU backend method createWebGPUBackend
import createWebGPUBackend from '@paddlejs/paddlejs-backend-webgpu';
// Import method registerBackend 
import { registerBackend } from '@paddlejs/paddlejs-core';

// Register the WebGPU backend to the global backend instance before initializing runner
createWebGPUBackend(registerBackend);

```

**Note**: 如果你想要运行 webGPU 计算方案，需要在 Chrome Canary 浏览器上运行。