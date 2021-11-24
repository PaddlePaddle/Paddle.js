[English](./README.md)

# @paddlejs-mediapipe/data-processor
此包提供了一些Paddle.js使用中数据处理的api

# npm

```bash
npm install @paddlejs-mediapipe/data-processor
```

# Usage

```javascript
import { genFeedData } from '@paddlejs-mediapipe/data-processor';

const options = {
    targetShape: [1, 3, 224, 224], // 必选
    mean: [0.5, 0.5, 0.5], // 可选
    std: [1, 1, 1], // 可选
    colorType: 0, // 0: rgb; 1: bgr; default 0
    normalizeType: 0 // data normalize type: 0: 0~1; 1：-1~1; default 0
};

// 长度为与targetShape一致的数组
const data = Array.from(new Array(3 * 224 * 224), () => 244);
const feedData = genFeedData(data, options);

// 使用 numjs
const numData = nj.array([1, 2, 3, 4], 'float32');
const reshapedData = nj.reshape(numData, [2, 2]);
const transposedData = nj.transpose(1, 0);
const flattenedData = transposedData.flatten();
```