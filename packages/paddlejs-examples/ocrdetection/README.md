[中文版](./README_cn.md)

# ocr_detect

ocr_detect model is used to detect the text area in the image.

# Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

# Usage

```js

import * as ocr from '@paddlejs-models/ocrdet';

// Load ocr_detect model
await ocr.load();

// Get text area points
const res = await ocr.detect(img);

```
