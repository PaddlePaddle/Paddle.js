# paddlejs-backend-webgpu

This package implements an experimental backend based on WebGPU for Paddle.js. (https://gpuweb.github.io/gpuweb/)

## Importing

You can install the backend package via npm. `@paddlejs/paddlejs-backend-webgpu`.


```js

// Import @paddlejs/paddlejs-core
import { registerBackend, Runner } from '@paddlejs/paddlejs-core';
// Import the WebGPU backend and ops
import { backend, ops } from '@paddlejs/paddlejs-backend-webgpu';

// Register the WebGPU backend to the global backend instance before initializing runner
registerBackend(
    'webgpu', // e.g. 'webgpu', you can name it by yourself
    backend, // backend instance
    ops // backend ops
);
```

**Note**: If you want to run webGPU backend demo, you need run it in the Chrome Canary application.