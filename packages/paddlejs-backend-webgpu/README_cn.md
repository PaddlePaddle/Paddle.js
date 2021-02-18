[English](./README.md)

# paddlejs-backend-webgpu

实现了 Paddle.js 的基于 WebGPU 计算方案，但该计算方案仍然是实验阶段，**WebGPU** 仍处于草案阶段 (https://gpuweb.github.io/gpuweb/)

## 安装

可以通过 npm 安装 `@paddlejs/paddlejs-backend-webgpu`


```js

// Import the registered WebGPU backend.
import '@paddlejs/paddlejs-backend-webgpu';

```

**Note**: 如果你想要运行 webGPU 计算方案，需要在 Chrome Canary 浏览器上运行。