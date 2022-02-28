[中文](./README_cn.md)

# Paddle.js Core
As the core part of the Paddle.js ecosystem, this package hosts `@paddlejs/paddlejs-core`,
which is responsible for the operation of the inference process of the entire engine,
and provides interfaces for backend registration and environment variable registration.

<img src="https://img.shields.io/npm/v/@paddlejs/paddlejs-core?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs/paddlejs-core" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs/paddlejs-core?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs/paddlejs-core" alt="downloads">


## RunnerConfig

When registering the engine you need to configure the engine, you must configure the items `modelPath`, `feedShape`, all items are configured as follows.

```typescript

// model struture
enum GraphType {
    SingleOutput = 'single',
    MultipleOutput = 'multiple',
    MultipleInput = 'multipleInput'
}

interface RunnerConfig {
    modelPath: string; // model path (local or web address)
    modelName?: string; // model name
    feedShape: { // input feed shape
        fc?: number; // feed channel, default is 3.
        fw: number; // feed width
        fh: number; // feed height
    };
    fill?: Color; // the color used to padding
    mean?: number[]; // mean value
    std?: number[]; // standard deviation
    bgr?: boolean; // whether the image channel alignment is BGR, default is false (RGB)
    type?: GraphType; // model structure, default is singleInput and singleOutput
    needPreheat?: boolean; // whether to warm up the engine during initialization, default is true
    plugins?: { // register model topology transform plugin
        preTransforms?: Transformer[]; // transform before creating network topology
        transforms?: Transformer[]; // transform when traversing model layers
        postTransforms?: Transformer[]; // transform the model topology diagram after it has been created
    };
}

```
## Importing
You can install this package via npm., `@paddlejs/paddlejs-core`

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
    webglFeedProcess?: true // Turn on `webglFeedProcess` to convert all pre-processing parts of the model to shader processing, and keep the original image texture.
});

// init runner
await runner.init();
// predict and get result
const res = await runner.predict(mediadata, callback?);
```

**Note**: If you are importing the Core package, you also need to import a backend (e.g.,
[paddlejs-backend-webgl](/packages/paddlejs-backend-webgl), [paddlejs-backend-webgpu](/packages/paddlejs-backend-webgpu)).


## High-level use

1. `@paddlejs/paddlejs-core` provides the interface `registerOp`, through which developers can register custom operators.

2. `@paddlejs/paddlejs-core` provides the global variable `env` module, through which developers can register environment variables, using the following method:

    ```js
    // set env key/flag and value
    env.set(key, value);

    // get value by key/flag
    env.get(key);
    ```

3. transform model stucture

    By registering the model transformers through `runnerConfig.plugins`, developers can make changes (add, delete, change) to the model structure, such as pruning to remove unnecessary layers to speed up inference, or adding custom layers to the end of the model and turning post-processing into layers in the model to speed up post-processing.


4. Turn on performance flag for acceleration

    Paddle.js currently provides five performance `flags`, which can be set to `true` if you want to enable inference acceleration.


    ```js
    env.set('webgl_pack_channel', true);
    ```
    Turn on `webgl_pack_channel` and the eligible conv2d will use packing shader to perform packing transformations to improve performance through vectorization calculations.


    ```js
    env.set('webgl_force_half_float_texture', true);
    ```
    Enable `webgl_force_half_float_texture`, feature map uses half float `HALF_FLOAT`.

    ```js
    env.set('webgl_gpu_pipeline', true);
    ```
    Turn on `webgl_gpu_pipeline` to convert all model pre-processing parts to shader processing, and render the model results to `WebGL2RenderingContext` of webgl backend on screen. Developers can perform model post-processing on the output texture and the original image texture to achieve the `GPU_PIPELINE`: pre-processing + inference + post-processing (rendering processing) to get high performance. Take humanseg model case for reference.


    ```js
    env.set('webgl_pack_output', true);
    ```
    Enable `webgl_pack_output` to migrate the `NHWC` to `NCHW` layout transformation of the model output to the GPU, and `pack` to a four-channel layout to reduce loop processing when reading the results from the GPU