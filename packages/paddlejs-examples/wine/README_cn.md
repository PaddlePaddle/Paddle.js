[English](./README.md)

# wine

wine 为酒瓶识别模块，基于 MobileNetV2 model，使用者需传入模型文件路径和分类映射文件，即可获得分类结果。

# 安装
```
npm install
```

### 编译
```
npm run dev
```

### 构建
```
npm run build
```

# 使用

```js
import * as mobilenet from '@paddlejs-models/mobilenet';

// 模型加载
const path = 'https://paddlejs.bj.bcebos.com/models/fuse/mobilenet/wine_fuse_activation/model.json';
await mobilenet.load({
    path,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225]
}, map);

// 获取分类结果
const res = await mobilenet.classify(img);

```
# 在线体验

酒瓶识别：https://paddlejs.baidu.com/wine

# 效果
<img alt="wine" src="https://user-images.githubusercontent.com/43414102/156372713-d07e190f-bdb6-433e-a5cd-866fffbbb5d6.gif">

