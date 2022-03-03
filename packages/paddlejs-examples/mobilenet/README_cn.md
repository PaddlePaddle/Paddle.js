[English](./README.md)

# mobilenet

mobilenet 模型可以对图片进行分类，提供的接口简单，使用者传入自己的分类模型去分类。

# 安装
```
npm install
```

### 编译
```
npm run dev
```

# 使用

```js
import * as mobilenet from '@paddlejs-models/mobilenet';

// 使用者需要提供分类模型的地址和二进制参数文件个数，且二进制参数文件，参考 chunk_1.dat、chunk_2.dat，...
// 模型参数支持 mean 和 std。如果没有，则不需要传
// 还需要传递分类映射文件
await mobilenet.load({
    path,
    fileCount: 4,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225]
}, map);

// 获取图片分类结果
const res = await mobilenet.classify(img);

```
# 在线体验

1000物品识别：https://paddlejs.baidu.com/mobilenet

# 效果
<img alt="image" src="https://user-images.githubusercontent.com/43414102/156393394-ab1c9e4d-2960-4fcd-ba22-2072fa9b0e9d.png">
