[English](./README.md)

# ocr_detect

ocr_detect模型用于检测图像中文字区域。

<img src="https://img.shields.io/npm/v/@paddlejs-models/ocrdet?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs-models/ocrdet" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs-models/ocrdet?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs-models/ocrdet" alt="downloads">

# 运行 Demo
1. 在当前目录下执行
``` bash
npm install
npm run dev
```
2. 访问 http://0.0.0.0:8870

# 使用

```js
import * as ocr from '@paddlejs-models/ocrdet';

// ocr_detect模型加载
await ocr.load();

// 获取文字区域坐标
const res = await ocr.detect(img);

```

# 在线体验

https://paddlejs.baidu.com/ocrdet

# 效果
<img alt="image" src="https://user-images.githubusercontent.com/43414102/156394295-5650b6c5-65c4-42a7-bccc-3ed459577b9d.png">

