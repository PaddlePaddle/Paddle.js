[中文版](./README_cn.md)

# paddlejs-backend-webgpu

This package implements an experimental backend based on WebGPU for Paddle.js. (https://gpuweb.github.io/gpuweb/)

## Importing

You can install the backend package via npm. `@paddlejs/paddlejs-backend-webgpu`.


```js

// Import the WebGPU backend method createWebGPUBackend
import createWebGPUBackend from '@paddlejs/paddlejs-backend-webgpu';
// Import method registerBackend 
import { registerBackend } from '@paddlejs/paddlejs-core';

// Register the WebGPU backend to the global backend instance before initializing runner
createWebGPUBackend(registerBackend);

```

**Note**: If you want to run webGPU backend demo, you need run it in the Chrome Canary application.