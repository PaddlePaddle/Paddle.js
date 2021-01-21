[English](./README.md)

# 人像分割

实时的人像分割模型。使用者可以用于背景替换。需要使用接口 getGrayValue 获取灰度值。
然后使用接口 drawHumanSeg 绘制分割出来的人像；也可以使用 drawMask 接口绘制背景，可以配置参数来获取全黑背景或者原图背景。

# 使用

```js

import * as humanseg from '@paddlejs-models/humanseg';

// 下载模型
await humanseg.load();

// 获取灰度值
const { data } = await humanseg.getGrayValue(img);

// 绘制分割出来的人像
const canvas1 = document.getElementById('demo1') as HTMLCanvasElement;
humanseg.drawHumanSeg(canvas1, data);

// 绘制分割后的背景，第三个参数是是否使用 dark 模式，如果使用，背景为 黑色
const canvas2 = document.getElementById('demo2') as HTMLCanvasElement;
humanseg.drawMask(canvas2, data, true);

```