[中文版](./README_cn.md)

# humanseg

A real-time human-segmentation model. You can use it to change background. The output of the model is gray value. Model supplies simple api for users. Api drawHumanSeg can draw human segmentation, another one drawMask can draw the background without human.


# Usage

```js

import * as humanseg from '@paddlejs-models/humanseg';

// load humanseg model
await humanseg.load();

// get the gray value [192 * 192];
const { data } = await humanseg.getGrayValue(img);

// draw human segmentation
const canvas1 = document.getElementById('demo1') as HTMLCanvasElement;
humanseg.drawHumanSeg(canvas1, data);

// draw the background mask
const canvas2 = document.getElementById('demo2') as HTMLCanvasElement;
humanseg.drawMask(canvas2, data, true);

```