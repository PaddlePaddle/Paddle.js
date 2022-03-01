[中文版](./README_cn.md)

# gesture

gesture is a gesture recognition module, including two models: gesture_detect and gesture_rec. gesture_detect model is used to identify the palm area of the person in the image. gesture_rec model is used to recognize human gesture. The interface provided by the module is simple, users only need to pass in gesture images to get the results.

<img src="https://img.shields.io/npm/v/@paddlejs-models/gesture?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs-models/gesture" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs-models/gesture?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs-models/gesture" alt="downloads">


# Run Demo
1. Execute in the current directory
``` bash
npm install
npm run dev
```
2. Visit http://0.0.0.0:8865


# Usage

```js

import * as gesture from '@paddlejs-models/gesture';

// Load gesture_detect model and gesture_rec model
await gesture.load();

// Get the image recognition results. The results include: palm frame coordinates and recognition results
const res = await gesture.classify(img);

```
