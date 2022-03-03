[English](./README.md)

# ocr_detect

ocr_detect模型用于检测图像中文字区域。

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
import * as ocr from '@paddlejs-models/ocrdet';

// ocr_detect模型加载
await ocr.load();

// 获取文字区域坐标
const res = await ocr.detect(img);

```

# 在线体验

https://paddlejs.baidu.com/ocrdet

# 效果
<img alt="image" src="https://user-images.githubusercontent.com/43414102/156394295-5650b6c5-65c4-42a7-bccc-3ed459577b9d.png">
