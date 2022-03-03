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

# Online experience

https://paddlejs.baidu.com/ocrdet

# Performance
<img alt="image" src="https://user-images.githubusercontent.com/43414102/156394295-5650b6c5-65c4-42a7-bccc-3ed459577b9d.png">
