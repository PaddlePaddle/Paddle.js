[English](./README.md)

# paddlejs-backend-nodegl

实现了 Paddle.js 在 Node.js 中的计算方案。该方案使用 webgl 方案的算子，可以在 Node.js 环境里运行模型。
通过 npm 包 [gl](https://github.com/stackgl/headless-gl) 在 Node.js 创建 WebGL 上下文，不需要再通过一个浏览器环境获取。

## 安装

可以通过 npm 安装 `@paddlejs/paddlejs-backend-nodegl`


```js

// Import the registered NodeGL backend.
import '@paddlejs/paddlejs-backend-nodegl';

```
