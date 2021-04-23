[English](./README.md)

# gesture

gesture 为手势识别模块，包括两个模型：gesture_detect和gesture_rec。gesture_detect模型识别图片中人物手掌区域，gesture_rec模型识别人物手势。模块提供的接口简单，使用者只需传入手势图片即可获得结果。

# 使用

```js
import * as gesture from '@paddlejs-models/gesture';

// gesture_detect、gesture_rec模型加载
await gesture.load();

// 获取图片识别结果。结果包括：手掌框选坐标和识别结果
const res = await gesture.classify(img);

```
