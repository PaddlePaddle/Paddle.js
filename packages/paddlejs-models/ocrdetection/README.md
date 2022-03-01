[中文版](./README_cn.md)

# ocr_detect

ocr_detect model is used to detect the text area in the image.

<img src="https://img.shields.io/npm/v/@paddlejs-models/ocrdet?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs-models/ocrdet" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs-models/ocrdet?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs-models/ocrdet" alt="downloads">

# Run Demo
1. Execute in the current directory
``` bash
npm install
npm run dev
```
2. Visit http://0.0.0.0:8870


# Usage

```js

import * as ocr from '@paddlejs-models/ocrdet';

// Load ocr_detect model
await ocr.load();

// Get text area points
const res = await ocr.detect(img);

```
