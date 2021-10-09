[中文版](./README_cn.md)

# ocr

Ocr is a text recognition module, which includes two models: ocr_detection and ocr_recognition。 Ocr_ detection model detects the region of the text in the picture, ocr_recognition model can recognize the characters (Chinese / English / numbers) in each text area. The module provides two interfaces. Users only need to input text pictures to obtain text area coordinates and text recognition results.

The input shape of the ocr_recognition model is [1, 3, 32, 320], and the selected area of the picture text box will be processed before the model reasoning: the width height ratio of the selected area of the picture text box is < = 10, and the whole selected area will be transferred into the recognition model; If the width height ratio of the frame selected area is > 10, the frame selected area will be cropped according to the width, the cropped area will be introduced into the recognition model, and finally the recognition results of each part of the cropped area will be spliced.

__tip：At present, model recognition is only applied to PC terminal, and the recognition effect of mobile terminal is still being optimized.__

# Usage

```js

import * as ocr from '@paddlejs-models/ocr';

// Load ocr_detect model
await ocr.load();

// Get text area points
const res = await ocr.detect(img);

// Get text area points and recognition results
const res = await ocr.recognition(img);
// recognition results
console.log(res.text);
// text area points
console.log(res.points);

```
