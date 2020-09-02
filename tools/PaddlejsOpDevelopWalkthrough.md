## Paddle.js算子开发流程

本文以conv2d_transpose算子为例，介绍标准化Paddle.js算子开发流程

### 在框架中新增算子以及功能对齐

在paddle官网上查到新算子文档，了解其属性和功能

https://paddlepaddle.org.cn/documentation/docs/zh/api_cn/layers_cn/conv2d_transpose_cn.html#conv2d-transpose

在`/src/utils/opData.es6`中指定新增op的behavior，如果有需要做预处理的请在这里指定相应的预处理函数。

```javascript
onst opBehavior = {
	  conv2d_transpose: [
        'needBatch'
        // 'adaptPaddings'
	],
```

在对应的路径中`/src/shader/conv2d_transpose/`实现相应的`conf.es6`,`params.es6`,`main.es6`文件。

三个文件具体的作用可以参考现有的算子，核心实现代码在`main.es6`中，其思路是如何计算得到每一个输出像素点的数据（逐个像素点计算输出）。

在`/src/factory/shader/ops.es6`中注册算子并导入算子的params， func，main三个文件：

```javascript
import conv2d_transpose_params from '../../shader/conv2d_transpose/params';
import conv2d_transpose_func from '../../shader/conv2d_transpose/main';
import conv2d_transpose_conf from '../../shader/conv2d_transpose/conf';
```

```javascript
    ops: {
    	conv2d_transpose:{
            params: conv2d_transpose_params,
            func: conv2d_transpose_func,
            confs: conv2d_transpose_conf
		},
```



### 输出对齐paddle以及单测的编写



之后利用此脚本获得paddle中算子的标准输入、输出、参数。注意运行脚本需要安装paddle，具体步骤请参考paddle官网教程。

```python
import paddle as paddle
import paddle.fluid as fluid
import numpy as np
# path为保存模型的路径
path = "./conv2d_transpose_model"

# 用户定义网络，此处以单个conv2d_transpose算子为例
img = fluid.layers.data(name='img', shape=[3,8,8], dtype='float32')
'''
对于需要手动输入权重参数的情况，可以使用fluid.initializer.NumpyArrayInitializer，此处给出一个例子，也可以参考paddle官网文档
param_attr=fluid.initializer.NumpyArrayInitializer(np.array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]).reshape((1,1,4,4)))
'''
result = fluid.layers.conv2d_transpose(input=img, num_filters=2, filter_size=4,padding = 1,stride = 2)


exe = fluid.Executor(fluid.CPUPlace())
exe.run(fluid.default_startup_program())

# 自定义输入
# x = np.arange(36)
# x = x.reshape((1,1,6,6)).astype("float32")
x = np.random.rand(1, 3, 8, 8).astype("float32")
# x = np.ones((1, 3, 8, 8)).astype("float32")
output = exe.run(feed={"img": x}, fetch_list=[result])
output = np.array(output)

print(x.shape)
print(output.shape)
x1=x.reshape(1,-1)
output1=output.reshape(1,-1)
# 将输入和输出保存到文件
np.savetxt("./input.txt", x1,fmt='%f',delimiter=',')
np.savetxt("./output.txt", output1,fmt='%f',delimiter=',')

# 保存预测模型。注意，用于预测的模型网络结构不需要保存标签和损失。
fluid.io.save_inference_model(dirname=path, feeded_var_names=['img'], target_vars=[result], executor=exe)
```

现在我们得到了三个文件，一个paddle fluid模型文件，一个标准输入数据和一个标准输出数据。

下一步我们利用Paddle.js的模型转换脚本获得算子的参数数据和Paddle.js模型文件。

在github repo `/tools/ModelConverter/convertModel.py`文件中，142行处添加两行代码用于将所有模型中自带的参数输出到文件：

```python
# persistable数据存入paramValuesDict，等待排序
if v.persistable:
  # 读取参数并将其维度展开
  dataStore = np.array(fluid.global_scope().find_var(v.name).get_tensor()).reshape(1,-1)
  # 将参数数据根据其名称保存到txt文件中
  np.savetxt("./"+v.name+".txt", dataStore,fmt='%f',delimiter=',')
  data = np.array(fluid.global_scope().find_var(v.name).get_tensor()).flatten().tolist()
  paramValuesDict[v.name] = data
```

之后运行模型转换工具脚本，至此我们得到model.json模型文件，txt格式的标准输入，参数，以及输出数据。

随后参考`/dist/test/unitData/model.test.conv2d_transpose.json`单测文件，编写相应算子的单测文件。

要运行新增的单测文件，首先在`/test/testUtils/testUtils.es6`中添加对应的path并指定运行的op：

```javascript
const unitPath = {
    'conv2d': 'model.test.conv2d.json',
    'batchnorm': 'model.test.batchnorm.json',
    'mul': 'model.test.mul.json',
    'pool2d': 'model.test.pool2d.json',
    'relu': 'model.test.relu.json',
    'scale': 'model.test.scale.json',
    'softmax': 'model.test.softmax.json',
    'relu6' : 'model.test.relu6.json',
	  'elementwise' : 'model.test.elementwise_add.json',
  	'depthwise' : 'model.test.depthwise_conv2d.json',
  	'reshape' : 'model.test.reshape.json',
  	'bilinear_interp' : 'model.test.bilinear_interp.json',
  	'transpose' : 'model.test.transpose.json',
	  'conv2d_transpose': 'model.test.conv2d_transpose.json',
  	'elementwise_add': 'model.test.elementwise_add.json',
    'concat': 'model.test.concat.json',
    'split': 'model.test.split.json'
};
const modelType = 'conv2d_transpose';
```

随后在运行 `npm run unitTest`，在控制台中查看输出，对比是否与标准输出对齐。

**如果有任何问题，欢迎在Github Issue上提出！或者加入我们的QQ群：696965088**