[中文版](./README_cn.md)

# Paddle.js

Paddle.js是百度Paddle的web方向子项目，是一个运行在浏览器中的开源深度学习框架。Paddle.js可以加载提前训练好的paddle模型，或者将paddle hub中的模型通过paddle.js的模型转换工具变成浏览器友好的模型进行在线推理预测使用。目前，paddle.js仅可以在支持webGL的浏览器中运行。

## 主要特点

### Modular

Web project is built on Atom system which is a versatile framework to support GPGPU operation on WebGL. It is quite modular and could be used to make computation tasks faster by utilizing WebGL.

### 浏览器覆盖范围

* PC: Chrome
* Mac: Chrome
* Android: Baidu App and QQ Browser

### 支持的操作

Currently Paddle.js only supports a limited set of Paddle Ops. See the full list. If your model uses unsupported ops, the Paddle.js script will fail and produce a list of the unsupported ops in your model. Please file issues to let us know what ops you need support with.
目前，Paddle.js只支持有限的一组算子操作。如果您的模型使用不支持的操作，那么padde.js将运行失败，如果您的模型中存在不支持的op操作的列表。请提出问题，让我们知道你需要支持。
[查看完整列表](./src/factory/fshader/README.md)


## 加载和运行模型

如果原始模型是浏览器友好的model格式, 使用 paddle.load()接在模型。

```bash

import Paddle from 'paddlejs';

let feed = io.process({
    input: document.getElementById('image'),
    params: {
        gapFillWith: '#000', // What to use to fill the square part after zooming
        targetSize: {
            height: fw,
            width: fh
        },
        targetShape: [1, 3, fh, fw], // Target shape changed its name to be compatible with previous logic
        // shape: [3, 608, 608], // Preset sensor shape
        mean: [117.001, 114.697, 97.404], // Preset mean
        // std: [0.229, 0.224, 0.225]  // Preset std
    }
});

const MODEL_CONFIG = {
    dir: `/${path}/`, // model URL
    main: 'model.json', // main graph
};

const paddle = new Paddle({
    urlConf: MODEL_CONFIG,
    options: {
        multipart: true,
        dataType: 'binary',
        options: {
            fileCount: 1, // How many model have been cut
            getFileName(i) { 
                return 'chunk_' + i + '.dat';
            }
        }
    }
});

model = await paddle.load();

// run model
let inst = model.execute({
    input: feed
});

// There should be a fetch execution call or a fetch output
let result = await inst.read();


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

- Questions, reports, and suggestions are welcome through Github Issues!
- Forum: Opinions and questions are welcome at our [PaddlePaddle Forum](https://ai.baidu.com/forum/topic/list/168)！
- QQ group chat: 696965088
