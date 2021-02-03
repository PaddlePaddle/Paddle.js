[English](./README.md)
# paddlejs-backend-webgl

此包为Paddle.js的benchmark性能统计页面， 统计了模型加载、预热、二次预测及最好的一次预测结果的耗时，还统计了每个算子的执行时间及其他信息。

## 使用
```
cd packages/paddlejs-benchmark
npm install
cd ../../
npm init
npm run benchmark

// 浏览器打开localhost:9000/index.html页面，根据页面表单提示使用
```