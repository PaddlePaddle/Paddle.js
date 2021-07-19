# 模型部署流程
使用一个新模型完成部署流程，需要如下步骤: 模型准备、模型转换、模型预测

## 模型准备
我们默认您的模型是paddle的模型，若需要转换的模型为 `TensorFlow/Caffe/ONNX` 格式，可使用 PaddlePaddle 项目下的 `X2Paddle`工具，将其他格式的模型转为 paddle 模型后，再使用本工具转化为 Paddle.js 模型。
详细请参考 [X2Paddle 项目](https://github.com/PaddlePaddle/X2Paddle)

## 模型转换
模型由模型文件与权重文件组成，模型文件有一个，权重参数文件有如下两种形式：
1. 权重参数文件合并成了单一的文件，一个模型对应一个参数文件，即合并参数文件。
2. 每个权重参数数据保存成了一个文件，即分片参数文件。

不同的权重参数文件形式，在模型转换工具中对应不同的参数：

- 如果待转换的 paddle 模型为`合并参数文件`:
``` bash
python convertToPaddleJSModel.py --modelPath=<paddle_model_file_path> --paramPath=<paddle_param_file_path> --outputDir=<paddlejs_model_directory>
```
- 如果待转换的 paddle 模型为`分片参数文件`：
``` bash
# 注意，使用这种方式调用转换器，需要保证 inputDir 中，模型文件名为'__model__'
python convertToPaddleJSModel.py --inputDir=<paddle_model_directory> --outputDir=<paddlejs_model_directory>
````
模型转换器将生成以下两种类型的文件以供 Paddle.js 使用：

- model.json (模型结构与参数清单)
- chunk_\*.dat (二进制参数文件集合)

### 详细使用方式
参数 |  描述
:-: | :-:
--inputDir | paddle 模型所在目录，当且仅当使用分片参数文件时使用该参数，将忽略 `modelPath` 和 `paramPath` 参数，且模型文件名必须为`__model__`
--modelPath | paddle 模型文件所在路径，使用合并参数文件时使用该参数
--paramPath | paddle 参数文件所在路径，使用合并参数文件时使用该参数
--outputDir | `必要参数`， Paddle.js 模型输出路径
--optimize | 是否进行模型优化， `0` 为关闭优化，`1` 为开启优化（需安装 PaddleLite ），默认关闭优化
--logModelInfo | 是否打印模型结构信息， `0` 为不打印， `1` 为打印，默认不打印
--sliceDataSize | 分片输出 Paddle.js 参数文件时，每片文件的大小，单位：KB，默认 4096

至此，你已经有了Paddle.js推理所需的模型，进入到模型推理环节前还需确保模型的算子Paddle.js已全部支持，若已全部支持，则继续完成下面的推理。
## 模型推理
推理过程分为： backend注册、构造推理实例、实例初始化、推理等步骤

1. 选定backend，即为您的模型转定合适的计算方案，此处以webgl backend为例，注册方式为：
```
import '@paddlejs/paddlejs-backend-webgl';
```
2. 构造推理实例&初始化&推理
构造推理实例及后续步骤，需要先引入@paddlejs/paddlejs-core模块，然后进行实例化及推理，方式如下：

```
// 引入core模块
import { Runner } from '@paddlejs/paddlejs-core';

// 构造推理实例
const runner = new Runner({
    // 模型路径，路径下包含model.json及*.chunk文件
    modelPath: 'https://paddlejs.cdn.bcebos.com/models/gesture_detection',
    // 模型要求的输入shape
    feedShape: {
        fw: detFeedShape,
        fh: detFeedShape
    },
    // 模型输入图片的目标尺寸，用于模型输入数据的处理
    targetSize: {
        height: detFeedShape,
        width: detFeedShape
    }
    // 模型按目标尺寸裁剪后的空间颜色填充
    fill: '#fff'
});

// 推理初始化，用于完成模型加载与预热
runner.init();

// 模型预测，需要传入输入数据，此处假设输入数据是image
const result = runner.predict(image);

```

