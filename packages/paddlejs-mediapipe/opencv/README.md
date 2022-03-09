[中文版](./README_cn.md)

# opencv_blur.js

A lightweight npm package which just includes modules **core imgproc js video**.
Modify the [opencv](/https://github.com/opencv/opencv) build_js script to package a few modules and api.

# opencv.js

Opencv3.4 contains most of the commonly used APIs, supporting cv.boxPoints api.

# opencv_ocr.js

Encapsulate the opencv API used by ocr module, Containing the following api:
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

# modules 
OpenCV modules:
--     To be built:                 **core imgproc js video**
--     Disabled:                    calib3d dnn features2d flann highgui imgcodecs ml photo stitching videoio world
--     Disabled by dependency:      objdetect
--     Unavailable:                 gapi java python2 python3 ts
--     Applications:                -
--     Documentation:               js
--     Non-free algorithms:         NO


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

1、cv.mean api has precision error when calculating floating-point numbers
