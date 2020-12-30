[English](./README.md)

# Paddle.js webgl backend

Paddle.js webgl后端使用GPU加速进行模型预测，需要在调用paddlejs-core包中的predict api前完成注册

## 通过NPM引入

```js
// 注册webgl后端
import registerWebGLBackend from '@paddlejs/paddlejs-backend-webgl';

registerWebGLBackend();
```

## 通过script标签引入

```html
<!-- 引入@paddlejs/paddlejs-core -->
<script src="https://paddlejs.cdn.bcebos.com/paddlejs/paddlejs-core"></script>

<!-- 注册webgl后端 -->
<script src="https://paddlejs.cdn.bcebos.com/paddlejs/paddlejs-backend-webgl"></script>
```