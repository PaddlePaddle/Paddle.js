[中文](./README_cn.md)

# Paddle.js Core
As the core part of the Paddle.js ecosystem, this package hosts `@paddlejs/paddlejs-core`,
which is responsible for the operation of the inference process of the entire engine, 
and provides interfaces for backend registration and environment variable registration.

## Importing
You can install this package via npm., `@paddlejs/paddlejs-core`

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

**Note**: If you are importing the Core package, you also need to import a backend (e.g., 
[paddlejs-backend-webgl](/packages/paddlejs-backend-webgl), [paddlejs-backend-webgpu](/packages/paddlejs-backend-webgpu)).

