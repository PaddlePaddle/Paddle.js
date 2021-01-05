[English](./README.md)
# paddlejs-backend-webgl

paddlejs的webgl后端利用GPU加速进行模型预测，需要在调用[paddlejs-core](../paddlejs-core/README_cn.md)中的predict api前完成注册。

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