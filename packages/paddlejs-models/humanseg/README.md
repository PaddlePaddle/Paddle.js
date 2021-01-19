[中文版](./README_cn.md)

# humanseg

A real-time human-segmentation model. You can use it to change background. The output of the model is gray value.


# Usage

```js

import * as humanseg from '@paddlejs-models/humanseg';

// load humanseg model
await humanseg.load();

// get the gray value [192 * 192];
const res = await humanseg.seg(img);

```