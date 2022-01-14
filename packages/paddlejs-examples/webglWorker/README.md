[中文版](./README_cn.md)

# 1000-Clas in WebWorker

This demo help us to use Paddle.js in WebWorker.

### core api
* [OffscreenCanvas()](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas)
![image](https://user-images.githubusercontent.com/10822846/149539774-d62ca0ca-6c25-4181-8720-35023273ae5a.png)

* [createImageBitmap()](https://developer.mozilla.org/en-US/docs/Web/API/CreateImageBitmap)
![image](https://user-images.githubusercontent.com/10822846/149540131-50679051-2b60-46e1-b969-fac21dd17dbd.png)

* [postMessage transderable](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable)
Support ArrayBuffer、MessagePort and ImageBitmap

```js
worker.postMessage(arrayBuffer, [arrayBuffer]);
```

### Setup
```
npm install
```

### run
```bash
npm run dev

# visit http://0.0.0.0:8866/
```

