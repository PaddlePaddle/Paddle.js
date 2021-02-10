[English](./README.md)

# @paddlejs-mediapipe/camera
此包实现功能为访问用户设备摄像头，获取视频流，在页面上实时展示。

# npm

```bash
npm install @paddlejs-mediapipe/camera
```

# Usage

```javascript
import Camera from '@paddlejs-mediapipe/camera';

const camera = new Camera(video, option);
// 视频播放
camera.start();
// 视频暂停
camera.pause();
// 视频停止
camera.stop();
```
