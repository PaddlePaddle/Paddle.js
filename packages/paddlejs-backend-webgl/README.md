[中文版](./README_cn.md)

# Paddle.js webgl backend

This package is WebGL backend accelerated by GPU registered before preheat api calling in paddlejs-core pacakge

## Via NPM

```js
// register webgl backend.
import registerWebGLBackend from '@paddlejs/paddlejs-backend-webgl';

registerWebGLBackend();
```

## Via a script tag

```html
<!-- Import @paddlejs/paddlejs-core -->
<script src="https://paddlejs.cdn.bcebos.com/paddlejs/paddlejs-core"></script>

<!-- registry webgl backend-->
<script src="https://paddlejs.cdn.bcebos.com/paddlejs/paddlejs-backend-webgl"></script>
```