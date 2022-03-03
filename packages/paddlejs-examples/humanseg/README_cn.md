[English](./README.md)

# 人像分割

实时的人像分割模型。使用者可以用于背景替换。需要使用接口 getGrayValue 获取灰度值。
然后使用接口 drawHumanSeg 绘制分割出来的人像，实现背景替换；使用接口 blurBackground 实现背景虚化；也可以使用 drawMask 接口绘制背景，可以配置参数来获取全黑背景或者原图背景。

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

// 引入 humanseg sdk
import * as humanseg from '@paddlejs-models/humanseg/lib/index_gpu';

// 默认下载 398x224 shape 的模型，默认执行预热
await humanseg.load();

// 指定下载更轻量模型, 该模型 shape 288x160，预测过程会更快，但会有少许精度损失
// await humanseg.load(true, true);

// 获取 background canvas
const back_canvas = document.getElementById('background') as HTMLCanvasElement;

// 背景替换， 使用 back_canvas 作为新背景实现背景替换
const canvas1 = document.getElementById('back') as HTMLCanvasElement;
await humanseg.drawHumanSeg(input, canvas1, back_canvas) ;

// 背景虚化
const canvas2 = document.getElementById('blur') as HTMLCanvasElement;
await humanseg.drawHumanSeg(input, canvas2) ;

// 绘制人型遮罩，在新背景上隐藏人像
const canvas3 = document.getElementById('mask') as HTMLCanvasElement;
await humanseg.drawMask(input, canvas3, back_canvas);

```

# 在线体验

https://paddlejs.baidu.com/humanseg

# 效果
<img alt="humanseg" src="https://user-images.githubusercontent.com/43414102/156384741-83f42d25-7062-49e1-9106-677bbbefbcfb.jpg">



