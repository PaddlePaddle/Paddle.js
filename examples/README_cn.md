# PaddleJS Examples

百度PaddleJS使用现成的 JavaScript 模型或转换 Paddle 模型以在浏览器中运行。

## 演示

目前Web项目运行TinyYolo模型可以达到30ms以内，对于一般的实时场景已经足够应对。

### 模块化

## 浏览器覆盖面

* PC: Chrome
* Mac: Chrome
* Android: Baidu App and QQ Browser

## 构建部署

```bash
npm install                         # 安装依赖
npm run tinyYolo              # 启动 tinyYolo 在线推理服务
```

## 如何预览 demo

1. 在浏览器中打开url: https://localhost:端口号/
2. 点击【开始检测】按钮。
3. 将人脸对准摄像头，没有问题的话，可以正常检测到人脸。

## 效果

![image](./tinyYolo/demoshow.png)
