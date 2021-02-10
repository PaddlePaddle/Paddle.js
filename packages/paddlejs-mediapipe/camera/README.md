[中文版](./README_cn.md)

# @paddlejs-mediapipe/camera
The function of this package is to access the user's device camera, obtain the video stream, and display it on the page in real time.

# npm

```bash
npm install @paddlejs-mediapipe/camera
```

# Usage

```javascript
import Camera from '@paddlejs-mediapipe/camera';

const camera = new Camera(video, option);
// video play
camera.start();
// video pause
camera.pause();
// video stop
camera.stop();
```
