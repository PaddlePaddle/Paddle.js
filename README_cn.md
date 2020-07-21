[中文版](./README_cn.md)

# Paddle.js

Paddle.js是百度Paddle的web方向子项目，是一个运行在浏览器中的开源深度学习框架。Paddle.js可以加载提前训练好的paddle模型，或者将paddle hub中的模型通过paddle.js的模型转换工具变成浏览器友好的模型进行在线推理预测使用。目前，paddle.js仅可以在支持webGL的浏览器中运行。

## 主要特点

### 模块化

Paddle.js项目基于Atom系统构建，该系统是一个通用框架，可支持WebGL上的GPGPU操作。 它非常模块化，可以通过利用WebGL来更快地执行计算任务。

### 浏览器覆盖范围

* PC: Chrome, firefox
* Mac: Chrome, Safari
* Android: Baidu App , UC, Chrome and QQ Browser

### 支持的操作

目前，Paddle.js只支持有限的一组算子操作。如果您的模型中使用了不支持的操作，那么padde.js将运行失败并提示您的模型中有哪些op算子目前还不支持。如果您的模型中存在目前Paddle.js不支持的算子，请提出问题，让我们知道你需要支持。
[查看完整列表](./src/factory/fshader/README.md)


## 加载和运行模型

如果原始模型是浏览器友好的model格式, 使用 paddle.load()加载模型。

```bash

import {runner as Paddlejs} from 'paddlejs';

const paddlejs = new Paddlejs({
        modelPath: 'model/mobilenetv2', // model path
        fileCount: 4, // model data file count 可以不填写
        feedShape: {  // input shape
            fw: 256,
            fh: 256
        },
        fetchShape: [1, 1, 1920, 10],  // output shape
        fill: '#fff',   // fill color when resize image
        needBatch: true, // whether need to complete the shape to 4 dimension
        inputType: 'image' // whether is image or video
    });

// load paddlejs model and preheat
await paddlejs.loadModel();

// run model
await paddlejs.predict(img, postProcess);

function postProcee(data) {
    // data为预测结果
    console.log(data);
}

```

对于前输入处理的有关详细信息，请参阅feed文档。

对于得到结果后输出处理的有关详细信息，请参阅fetch文档。


## 运行Paddle.js提供的转换器脚本

模型转换器需要输入一个Paddle格式的model，可以是Paddle Hub中的model，运行转换器将会得到paddle.js的JSON格式model。

## Web友好的model格式

上面的转换脚本生成两种类型的文件：

 - model.json (数据流图和权重清单文件)
 - group1-shard\*of\* (二进制权重文件的集合)


## 预览演示

Paddle.js已经将一些模型转换成了Paddle.js支持的格式。在下面的URL中有一些演示，打开一个带有演示的浏览器页面。
[查看更多](./examples/README.md)


## 反馈和社区支持
- 在线视频课程 [开始学习](https://www.bilibili.com/video/BV1gZ4y1H7UA?p=6)
- 欢迎在Github Issue中提出问题，反馈和建议！
- 欢迎在我们的[PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)提出观点，进行讨论！
- QQ群：696965088
