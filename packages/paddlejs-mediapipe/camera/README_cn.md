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

const option = {
    // 视频流宽度
    width?: number,
    // 视频流高度
    height?: number,
    // 是否镜像
    mirror?: boolean,
    // 目标canvas DOM对象
    targetCanvas?: HTMLCanvasElement,
    // 视频流渲染成功
    onSuccess?: () => void,
    // 视频流渲染失败
    onError?: NavigatorUserMediaErrorCallback,
    // 浏览器不支持getUserMedia API
    onNotSupported?: () => void,
    // 获取视频流每一帧
    onFrame?: (canvas: HTMLCanvasElement) => void,
    // 切换摄像头失败
    switchError?: () => void,
    // 视频加载结束
    videoLoaded?: () => void
};

const camera = new Camera(video, option);
// 视频播放
camera.start();
// 视频暂停
camera.pause();
// 切换摄像头
camera.switchCameras();
```
