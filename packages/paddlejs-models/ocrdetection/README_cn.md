[English](./README.md)

# ocr_detect

ocr_detect模型用于检测图像中文字区域。

# 使用

```js
import * as ocr from '@paddlejs-models/ocrdet';

// ocr_detect模型加载
await gesture.load();

// 获取文字区域坐标
const res = await ocr.classify(img);

```
