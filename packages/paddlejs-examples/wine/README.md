[中文版](./README_cn.md)

# wine

Wine is a wine bottle recognition module. Based on mobilenetv2 model, users need to input the model file path and classification mapping file to obtain the classification results.

# Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

# Usage

```js
import * as mobilenet from '@paddlejs-models/mobilenet';

// model load
const path = 'https://paddlejs.bj.bcebos.com/models/fuse/mobilenet/wine_fuse_activation/model.json';
await mobilenet.load({
    path,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225]
}, map);

// get classification results
const res = await mobilenet.classify(img);

```
# Online experience

wine：https://paddlejs.baidu.com/wine

# Performance
<img alt="wine" src="https://user-images.githubusercontent.com/43414102/156372713-d07e190f-bdb6-433e-a5cd-866fffbbb5d6.gif">
