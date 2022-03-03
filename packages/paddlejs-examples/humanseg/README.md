[中文版](./README_cn.md)

# humanseg

A real-time human-segmentation model. You can use it to change background. The output of the model is gray value. Model supplies simple api for users.

Api drawHumanSeg can draw human segmentation with a specified background.
Api blurBackground can draw human segmentation with a blurred origin background.
Api drawMask can draw the background without human.

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

import * as humanseg from '@paddlejs-models/humanseg/lib/index_gpu';

// load humanseg model, use 398x224 shape model, and preheat
await humanseg.load();

// use 288x160 shape model, preheat and predict faster with a little loss of precision
// await humanseg.load(true, true);

// background canvas
const back_canvas = document.getElementById('background') as HTMLCanvasElement;

// draw human segmentation
const canvas1 = document.getElementById('back') as HTMLCanvasElement;
await humanseg.drawHumanSeg(input, canvas1, back_canvas) ;

// blur background
const canvas2 = document.getElementById('blur') as HTMLCanvasElement;
await humanseg.drawHumanSeg(input, canvas2) ;

// draw the mask with background
const canvas3 = document.getElementById('mask') as HTMLCanvasElement;
await humanseg.drawMask(input, canvas3, back_canvas);

```

# Online experience

https://paddlejs.baidu.com/humanseg

# Performance
<img alt="humanseg" src="https://user-images.githubusercontent.com/43414102/156384741-83f42d25-7062-49e1-9106-677bbbefbcfb.jpg">
