[English](./README_cn.md)

# @paddlejs-mediapipe/data-processor
A npm package which provide APIs about dataProcessing in Paddle.js.

# npm

```bash
npm install @paddlejs-mediapipe/data-processor
```

# Usage

```javascript
import { genFeedData, nj } from '@paddlejs-mediapipe/data-processor';

const options = {
    targetShape: [1, 3, 224, 224], // required
    mean: [0.5, 0.5, 0.5],
    std: [1, 1, 1],
    colorType: 0, // 0: rgb; 1: bgr; default 0
    normalizeType: 0 // data normalize type: 0: 0~1; 1：-1~1; default 0
};

// Array data that the length should match the targetShape in options.
const data = Array.from(new Array(3 * 224 * 224), () => 244);
const feedData = genFeedData(data, options);

// use numjs
const numData = nj.array([1, 2, 3, 4], 'float32');
const reshapedData = nj.reshape(numData, [2, 2]);
const transposedData = nj.transpose(1, 0);
const flattenedData = transposedData.flatten();

```