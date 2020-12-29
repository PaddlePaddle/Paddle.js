[中文](./README_cn.md)

# Paddle.js Core
A core part of the Paddle.js ecosystem, this repo hosts `@paddlejs/paddlejs-core`,
which is responsible for the operation of the inference process of the entire engine, 
and provides interfaces for backend registration and environment variable registration.

## Importing
You can install this package via npm., `@paddlejs/paddlejs-core`

```js
import { registerBackend, Runner } from '@paddlejs/paddlejs-core';

const runner = new Runner({
    modelPath: '/model/mobilenetv2', // model path, eg http://xx.cc/path, http://xx.cc/path/model.json, /localModelDir/model.json, /localModelDir
    fileCount?: 4, // model data file count, default value is 1
    feedShape: {  // input shape
        fw: 256,
        fh: 256
    },
    fetchShape: [1, 1, 1920, 10],  // output shape
    fill?: '#fff',   // fill color when resize image, default value is #fff
    inputType?: 'image' // whether is image or video, default value is image
});

// You need to register backend and ops before initing runner
registerBackend(
    'webgpu', // 'webgl', 'webgpu', you can name it yourself
    backend, // backend instance
    ops // backend ops
);

// init runner
await runner.init();
// predict and get result
const res = await runner.predict(mediadata, callback?);
```

**Note**: If you are importing the Core package, you also need to import a backend (e.g., 
[paddlejs-backend-webgl](/packages/paddlejs-backend-webgl), [paddlejs-backend-webgpu](/packages/paddlejs-backend-webgpu)).

