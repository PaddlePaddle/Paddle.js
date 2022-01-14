[英文版](./README.md)

# 1000-Clas in WebWorker

这个 demo 帮助我们在 WebWorker 线程里使用 Paddle.js

### 核心 api

* [OffscreenCanvas() 离屏 canvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas)
![image](https://user-images.githubusercontent.com/10822846/149539774-d62ca0ca-6c25-4181-8720-35023273ae5a.png)

* [createImageBitmap() 创建 ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/CreateImageBitmap)
![image](https://user-images.githubusercontent.com/10822846/149540131-50679051-2b60-46e1-b969-fac21dd17dbd.png)

* [postMessage transderable](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable)
按引用传递，可以避免克隆导致的耗时，目前支持快速传递 ArrayBuffer、MessagePort and ImageBitmap，

```js
第二个参数指明 ImageBitmap 传递引用
worker.postMessage({
    event: 'predict',
    data: ImageBitmap
}, [ImageBitmap]);
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

