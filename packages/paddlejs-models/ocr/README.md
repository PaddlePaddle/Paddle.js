[中文版](./README_cn.md)

# ocr

Ocr is a text recognition module, which includes two models: ocr_detection and ocr_recognition。 Ocr_detection model detects the region of the text in the picture, ocr_recognition model can recognize the characters (Chinese / English / numbers) in each text area. 

The module provides a simple and easy-to-use interface. Users only need to upload pictures to obtain text recognition results.

The input shape of the ocr_recognition model is [1, 3, 32, 320], and the selected area of the picture text box will be processed before the model reasoning: the width height ratio of the selected area of the picture text box is < = 10, and the whole selected area will be transferred into the recognition model; If the width height ratio of the frame selected area is > 10, the frame selected area will be cropped according to the width, the cropped area will be introduced into the recognition model, and finally the recognition results of each part of the cropped area will be spliced.

[Ocr_detection](https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_det_infer.tar) model is downloaded from[paddleOCR](https://github.com/PaddlePaddle/PaddleOCR).

[ocr_recognition](https://paddlejs.bj.bcebos.com/models/ocr_rec_320_infer.zip) model is an inference model with an input shape of [1,3,32,320] derived from the [ch_ppocr_mobile_v2.0_rec_pre](https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_rec_pre.tar) training model.

__tip：At present, model recognition is only applied to PC terminal, and the recognition effect of mobile terminal is still being optimized.__

# Usage

```js

import * as ocr from '@paddlejs-models/ocr';

// Model initialization
await ocr.init();

// Get the text recognition result API, img is the user's upload picture, and option is an optional parameter
// option.canvas as HTMLElementCanvas：if the user needs to draw the selected area of the text box, pass in the canvas element
// option.style as object：if the user needs to configure the canvas style, pass in the style object
// option.style.strokeStyle as string：select a color for the text box
// option.style.lineWidth as number：width of selected line segment in text box
// option.style.fillStyle as string：select the fill color for the text box
const res = await ocr.recognize(img, option?);
// character recognition results
console.log(res.text);
// text area points
console.log(res.points);
```
