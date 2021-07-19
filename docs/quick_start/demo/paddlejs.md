# 背景

通过介绍paddlejs物品识别模型（mobilenet）如何快速接入到现有项目中，帮助开发者快速上手使用paddljs。

## 快速开始

### 安装

在项目根目录执行

```
npm i @paddlejs/paddlejs-core @paddlejs/paddlejs-backend-webgl
```
安装paddlejs底层基础依赖

### 页面中使用

#### 引入方法
```
import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
```
#### 预处理

模型预测前的处理统一称为预处理，预处理包含：模型预热、输入处理（根据需求，对需求进行特殊处理，比如：需求要求传入的图片大小是300X300，如果用户传入的图片大小不合适，需要开发者进行输入处理）。

模型预热
```
    let runner = new Runner({
        modelPath: 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2', // 模型路径
        fileCount: 4,
        feedShape: {
            fw: 224,
            fh: 224
        },
        fill: '#fff',
        targetSize: {
            height: 224,
            width: 224
        },
        mean: [0.485, 0.456, 0.406],
        std: [0.229, 0.224, 0.225],
        needPreheat: true
    });
    await runner.init();
```
模型预热可以让后续的模型预测加快速度，每个模型使用的参数不尽相同，需要训练模型的同学提供。
#### 模型预测
```
const res = await runner.predict(xxx);
```
输入的内容由模型决定，物品识别模型需要传入HTMLImageElement。

其中HTMLImageElement可以使用如下方法获取
```
const imageElement = new Image();
imageElement.onload = () => {
    const res = await runner.predict(imageElement);
};
imageElement.src = '你的图片地址';
```

#### 后处理
拿到模型预测结果后的处理统一称为后处理，开发者可以使用预测结果做自己想做的事情。

因为每个模型的返回值内容不同，所以需要做的处理也都不同，比如：物品识别模型预测的结果直接是物品名称字符串，手势识别模型返回的当前识别的物品名称和框选物品的四个点坐标。

物品识别的后处理直接把结果输出到你期望的dom中就可以了
```
document.getElementById('xxx').innerHTML = res;
```

其中packages/paddlejs-models/gesture/demo可以查看其他前端细节。