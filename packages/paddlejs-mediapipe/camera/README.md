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

const option = {
    // video width
    width?: number,
    // video height
    height?: number,
    // mirror or not
    mirror?: boolean,
    // canvas DOM
    targetCanvas?: HTMLCanvasElement,
    // video rendered successfully
    onSuccess?: () => void,
    // video rendering failed
    onError?: NavigatorUserMediaErrorCallback,
    // browser does not support the getusermedia API
    onNotSupported?: () => void,
    // get every frame of video
    onFrame?: (canvas: HTMLCanvasElement) => void,
    // switch camera error
    switchError?: () => void,
    // video loadedData
    videoLoaded?: () => void
};

const camera = new Camera(video, option);
// video play
camera.start();
// video pause
camera.pause();
// cameras switch
camera.switchCameras();
```

# Mobile compatibility
| system | phone browser | Baidu App | qq browser | uc browser | weChat |
| :---: | :---: | :---: | :---: | :---: | :---: |
| iOS 14  | support | support(14.2+) | support(14.4) | support(14.4) | won't support |
| iOS 13  | support | won't support | won't support | won't support | won't support |
| iOS 12  | support | won't support | won't support | won't support | won't support |
| iOS 11  | support | won't support | won't support | won't support | won't support |
| iOS 10  | won't support | won't support | won't support | won't support | won't support |
| iOS 9  | won't support | won't support | won't support | won't support | won't support |
| iOS 8  | won't support | won't support | won't support | won't support | won't support |
| Android 11 | support | support | support | support | support |
| Android 10 | support | support | support | support | support |
| Android 9 | support | support | support | support | support |
| Android 8 | support | support | support | support | support |
| Android 7 | support | support | support | support | support |
| Android 6 | support | support | won't support | won't support | support |
| Android 5 | support | support | won't support | won't support | support |
