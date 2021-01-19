[English](./README.md)

# 人像分割

实时的人像分割模型。使用者可以用于背景替换。模型返回灰度值。

# 使用

```js
import * as humanseg from '@paddlejs-models/humanseg';

await humanseg.load();

// 获取模型处理后的图片像素灰度值 [192 * 192]
const res = await humanseg.seg(img);

```