# 「寻物大作战」微信小程序代码示例

## 1.介绍
本目录为寻物大作战微信小程序代码，通过使用 [Paddle.js](https://github.com/PaddlePaddle/Paddle.js) 以及 [Paddle.js微信小程序插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx7138a7bb793608c3&token=956931339&lang=zh_CN) 完成在小程序上利用用户终端算力实现识物效果。

## 2. 项目启动

### 2.1 准备工作
* [申请微信小程序账号](https://mp.weixin.qq.com/)
* [微信小程序开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
* 前端开发环境准备：node、npm
* 小程序管理后台配置服务器域名，如果使用默认模型请配置为 https://mms-voice-fe.cdn.bcebos.com  
详情参考:https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=1132303404&lang=zh_CN)

### 2.2 启动步骤
#### **1. clone Paddle.js**
```sh
git clone https://github.com/PaddlePaddle/Paddle.js.git
```

#### **2. 进入 xxx 目录，安装依赖**
```sh
cd Paddle.js/packages/paddlejs-examples/xxx && npm install
```

#### **3. 微信小程序导入代码**
打开微信开发者工具 --> 导入 --> 选定目录，输入相关信息

#### **4. 添加 Paddle.js微信小程序插件**
小程序管理界面 --> 设置 --> 第三方设置 --> 插件管理 --> 添加插件 --> 搜索 `wx7138a7bb793608c3` 并添加  
[参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

#### <font color="red">**5. 构建依赖**</font>  
<font color="red">**！！（易遗漏） 点击开发者工具中的菜单栏：工具 --> 构建 npm**</font>  
***原因**：node_modules 目录不会参与编译、上传和打包中，小程序想要使用 npm 包必须走一遍“构建 npm”的过程，构建完成会生成一个 miniprogram_npm 目录，里面会存放构建打包后的 npm 包，也就是小程序真正使用的 npm 包。*  
[参考文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

### 2.3 效果展示
<img src="./exampleImage/demo1.gif" style="zoom:50%;" />

## 3. 实现思路说明
***主体实现思路可以归纳为，利用 Paddle.js 持续预测摄像头视频流中的图像信息，判断和题目物品是否相符。***

### **3.1 Paddle.js 实现推理预测**
```typescript
// 引入 paddlejs 和 paddlejs-plugin，注册小程序环境变量和合适的 backend
import * as paddlejs from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';
const plugin = requirePlugin('paddlejs-plugin');
plugin.register(paddlejs, wx);

// 初始化推理引擎
const runner = new paddlejs.Runner({modelPath, feedShape, mean, std}); 
await runner.init();

// 推理预测
const weightArr = await runner.predict(image);
```

### **3.2 onCameraFrame获取视频流**
小程序相机组件的 [onCameraFrame](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.onCameraFrame.html) 方法接收一个回调函数，会实时向回调函数中传入当前摄像头中的图像。针对传入的每帧图像使用 Paddle.js 进行预测，预测方法是 Paddle.js 的 `predict` API。该函数作为 Paddle.js 的推理 API，会根据不同的模型而产出具有不同意义的结果。本次使用的是物品分类模型，产出的结果是一个**置信度数组**，代表当前图像与各个物品匹配的置信度，置信度数组中最大一项所对应的物品就是最终的预测物品索引。
```typescript
// 注册回调数 处理视频流帧
const listener = cameraContext.onCameraFrame(frame => {
    // 推理
    const weightArr = await runner.predict(frame);
    // 获取置信度数组最大项的索引
    const maxIdx = res.index0f(Math.max.apply(null, weightArr));
    // 从物品列表中找到索引对应的物品
    const result = mobilenetMap[`${maxIdx}`];
    // 结合业务场景选择结果使用方式
    // ...
});

//开始捕获视频流
listener.start();
```

## 4. 更多
* [详细文档](https://mp.weixin.qq.com/s/GP1lc3FZ6lQyD7FJfU67xw)