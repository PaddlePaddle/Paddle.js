[English](./README.md)

# opencv_blur.js

一个轻量级 opencv 库，目前包含模块 **core imgproc js video**，主要用于边缘模糊处理。
修改 [opencv](/https://github.com/opencv/opencv) build_js 构建脚本，打包少量模块和api。

# opencv.js

opencv3.4版本，包含大多数常用api，增加 cv.boxPoints api。

# opencv_ocr.js

封装ocr模块所用到的opencv api，含有如下api：
```javascript
[
    'findContours', 
    'minAreaRect', 
    'boxPoints', 
    'fillPoly',
    'getPerspectiveTransform',
    'warpPerspective',
    'getRotationMatrix2D',
    'warpAffine',
    'resize'
]
```

# 模块

OpenCV 模块:
--     包含:                 **core imgproc js video**
--     禁用:                 calib3d dnn features2d flann highgui imgcodecs ml photo stitching videoio world

# npm

```bash
npm install @paddlejs-mediapipe/opencv
```

# Usage

```javascript
import cv from '@paddlejs-mediapipe/opencv/library/opencv_blur';
let logit = cv.imread('canvas');
let dst = new cv.Mat();
let ksize = new cv.Size(5, 5);
let anchor = new cv.Point(-1, -1);
cv.blur(logit, dst, ksize, anchor, cv.BORDER_DEFAULT);
```

# tips

1、cv.mean api在计算浮点数时存在精度误差
