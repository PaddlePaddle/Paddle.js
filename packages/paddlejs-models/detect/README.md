[中文版](./README_cn.md)

# detect

detect model is used to detect the position of label frame in the image.

# Usage

```js
import * as det from '@paddlejs-models/detect';

// Load model
await det.load();

// Get label index, confidence and coordinates
const res = await det.detect(img);

res.forEach(item => {
    // Get label index
    console.log(item[0]);
    // Get label confidence
    console.log(item[1]);
    // Get label left coordinates
    console.log(item[2]);
    // Get label top coordinates
    console.log(item[3]);
    // Get label right coordinates
    console.log(item[4]);
    // Get label bottom coordinates
    console.log(item[5]);
});
```

# effect
![img.png](https://user-images.githubusercontent.com/43414102/153805288-80f289bf-ca92-4788-b1dd-44854681a03f.png)
