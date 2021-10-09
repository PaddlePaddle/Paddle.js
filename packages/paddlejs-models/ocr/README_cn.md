[English](./README.md)

# ocr

ocr 为文本识别模块，包括两个模型：ocr_detection 和ocr_recognition。ocr_detection 模型检测图片中文本所在区域，ocr_recognition 模型可识别每个文本区域内的字符（中文/英文/数字）。模块提供两个接口，使用者只需传入文本图片即可获取文本区域坐标及文本识别结果。

ocr_recognition模型输入shape为[1, 3, 32, 320],模型推理前会对图片文本框选区域进行处理：图片文本框选区域宽高比 <= 10，将整个框选区域传入识别模型；框选区域宽高比 > 10，则对框选区域按宽度进行裁剪，将裁剪区域传入识别模型，最终拼接裁剪区域每一部分的识别结果。

__tip：目前模型识别仅应用于pc端，移动端识别效果还在优化中。__

# 使用

```js
import * as ocr from '@paddlejs-models/ocr';

// ocr模型加载
await ocr.load();

// 获取文本区域坐标
const res = await ocr.detect(img);

// 获取文本区域坐标及识别结果
const res = await ocr.recognition(img);
// 识别文字结果
console.log(res.text);
// 文本区域坐标
console.log(res.points);
```
