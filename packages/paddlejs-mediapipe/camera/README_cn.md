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

# Mobile compatibility
| 系统 | 自带浏览器 | 手百 | qq 浏览器 | uc 浏览器 | 微信 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| iOS 14  | 支持 | 支持(14.2+) | 支持(14.4) | 支持(14.4) | 不支持 |
| iOS 13  | 支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| iOS 12  | 支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| iOS 11  | 支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| iOS 10  | 不支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| iOS 9  | 不支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| iOS 8  | 不支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| Android 11 | 支持 | 支持 | 支持 | 支持 | 支持 |
| Android 10 | 支持 | 支持 | 支持 | 支持 | 支持 |
| Android 9 | 支持 | 支持 | 支持 | 支持 | 支持 |
| Android 8 | 支持 | 支持 | 支持 | 支持 | 支持 |
| Android 7 | 支持 | 支持 | 支持 | 支持 | 支持 |
| Android 6 | 支持 | 支持 | 不支持 | 不支持 | 支持 |
| Android 5 | 支持 | 支持 | 不支持 | 不支持 | 支持 |
