[English](./README.md)

# opencv_blur.js

一个轻量级 opencv 库，目前包含模块 **core imgproc js video**，主要用于边缘模糊处理。
修改 [opencv](/https://github.com/opencv/opencv) build_js 构建脚本，打包少量模块和api。

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