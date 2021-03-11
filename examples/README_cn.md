# PaddleJS Examples

百度PaddleJS使用现成的 JavaScript 模型或转换 Paddle 模型以在浏览器中运行。

## 演示

目前Web项目运行TinyYolo模型可以达到30ms以内，对于一般的实时场景已经足够应对。

### 模块化

## 浏览器覆盖面

* PC: Chrome
* Mac: Chrome
* Android: Baidu App and QQ Browser

## 安装环境
```bash
sudo npm install -g parcel-bundler
```

## 构建并预览
在项目根目录下运行
```bash
npm install # 安装依赖
npm run tinyYolo              # 启动 tinyYolo 在线推理服务
npm run humanStream     #动态人像抠图
npm run wine    #酒名识别。识别结果在console里
npm run benchmark   #各模型加载时间
npm run humanseg    #人像照片抠图
npm run tinyYolo    #人脸位置
npm run mobilenet    #三个物体的检测
npm run mobilenetOpt    #优化版的三个物体的检测
npm run terrorModel     #有bug运行不了
```
打开命令运行后提示的网址：Server running at http://localhost:1234
点击页面下方的开始识别按钮。

## 如何预览 demo

1. 在浏览器中打开url: https://localhost:端口号/
2. 点击【开始检测】按钮。
3. 将人脸对准摄像头，没有问题的话，可以正常检测到人脸。

## 效果

![image](./tinyYolo/demoshow.png)


## 运行单个文件
在项目根目录下运行
```bash
parcel examples/tinyYolo/videoDemo.html
```
打开其提示的网址：Server running at http://localhost:1234
点击页面下方的开始识别按钮。

## 生成生产环境可以使用的网页
```bash
parcel build examples/tinyYolo/videoDemo.html  --no-minify  --public-url ./
```
将dist文件夹传到您的网站