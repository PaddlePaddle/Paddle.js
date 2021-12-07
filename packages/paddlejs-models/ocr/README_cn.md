[English](./README.md)

# ocr

ocr 为文本识别模块，包括两个模型：ocr_detection 和 ocr_recognition。ocr_detection 模型检测图片中文本所在区域，ocr_recognition 模型可识别每个文本区域内的字符（中文/英文/数字）。

模块提供简单易用的接口，使用者只需上传图片即可获取文本识别结果。

ocr_recognition模型输入shape为[1, 3, 32, 320],模型推理前会对图片文本框选区域进行处理：图片文本框选区域宽高比 <= 10，将整个框选区域传入识别模型；框选区域宽高比 > 10，则对框选区域按宽度进行裁剪，将裁剪区域传入识别模型，最终拼接裁剪区域每一部分的识别结果。

[ocr_detection](https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_det_infer.tar)文本检测源模型下载自[paddleOCR](https://github.com/PaddlePaddle/PaddleOCR)。

[ocr_recognition](https://paddlejs.bj.bcebos.com/models/ocr_rec_320_infer.zip)文本识别源模型是通过[ch_ppocr_mobile_v2.0_rec_pre](https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_rec_pre.tar)预训练模型导出输入shape为[1, 3, 32, 320]的推理模型。

__tip：目前paddlejs模型识别仅应用于pc端，移动端识别效果还在优化中。__

# 使用

```js
import * as ocr from '@paddlejs-models/ocr';

// 模型初始化
await ocr.init();

// 获取文本识别结果API，img为用户上传图片，option为可选参数 
// option.canvas as HTMLElementCanvas：若用户需要绘制文本框选区域，传入canvas元素
// option.style as object：若用户需要配置canvas 样式，传入style 对象
// option.style.strokeStyle as string：文本框选颜色
// option.style.lineWidth as number：文本框选线段宽度
// option.style.fillStyle as string：文本框选填充颜色
const res = await ocr.recognize(img, option?);
// 识别文字结果
console.log(res.text);
// 文本区域坐标
console.log(res.points);
```
