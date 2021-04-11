import Camera from '../src/index';

const devices1 = [
    {
        deviceId: 'd7f3e03a5a257dbf6971d0dcbab6500a551dcbcc504e23a8b551bf1fbe810ce3',
        groupId: 'f39f440eb9c4ca88e693ac38d23ec4fc164ec713cef254a3f582550f88a11676',
        kind: 'videoinput',
        label: 'FaceTime高清摄像头（内建） (05ac:8514)'
    }
];

const devices2 = [
    {
        deviceId: 'd7f3e03a5a257dbf6971d0dcbab6500a551dcbcc504e23a8b551bf1fbe810ce3',
        groupId: 'f39f440eb9c4ca88e693ac38d23ec4fc164ec713cef254a3f582550f88a11676',
        kind: 'videoinput',
        label: 'FaceTime高清摄像头（内建） (05ac:8514)'
    },
    {
        deviceId: 'd7f3e03a5a257dbf6971d0dcbab6500a551dcbcc504e23a8b551bf1fbe810ce3',
        groupId: 'f39f440eb9c4ca88e693ac38d23ec4fc164ec713cef254a3f582550f88a11676',
        kind: 'videoinput',
        label: 'FaceTime高清摄像头（内建） (05ac:8514)'
    },
    {
        deviceId: '',
        groupId: 'a2ff53ce48b124997577a12db2ea48d5837ea3ba4adac070f5f0217c9f85d55f',
        kind: 'audioinput',
        label: ''
    }
];

const stream = {
    active: true,
    id: '8jjQVUg6xnlrxlFK0uOHRQqakLR6cadGao7u',
    onactive: null,
    onaddtrack: null,
    oninactive: null,
    onremovetrack: null
};

const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) '
    + 'Chrome/89.0.4389.90 Safari/537.36';

const iosUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 '
    + '(KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

test('camera constructor and not exist navigator.mediaDevices', () => {
    const mockFnNotSupported = jest.fn();
    const video = document.createElement('video');
    const camera = new Camera(
        // 用来显示摄像头图像的dom
        video, {
            width: 100,
            height: 100,
            onNotSupported: mockFnNotSupported
        });
    expect(video.width).toBe(100);
    expect(mockFnNotSupported).toHaveBeenCalled();
});

test('navigator.enumerateDevices.mediaDevices catch', async () => {
    const mockFnNotSupported = jest.fn();
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.reject({
        name: 'xxx',
        message: 'xxx'
    }));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            userAgent: ua
        }
    });
    const camera = await new Camera(
        video, {
            mirror: true,
            onNotSupported: mockFnNotSupported
        });
    expect(mockFnEnumerateDevices).toHaveBeenCalled();
});

test('exist navigator.mediaDevices and devices < 2', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices1));
    const mockFnGetUserMedia = jest.fn(() => Promise.resolve(stream));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices,
        getUserMedia: mockFnGetUserMedia
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            userAgent: ua
        }
    });
    const mockAddeventListener = jest.fn().mockImplementation((_event, fn) => {
        fn();
    });
    video.srcObject = null;
    video.addEventListener = mockAddeventListener;
    const camera = await new Camera(
        video, {
            mirror: false
        });
    expect(mockFnEnumerateDevices).toHaveBeenCalled();
});

test('exist navigator.mediaDevices and devices > 1', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices2));
    const mockFnGetUserMedia = jest.fn(() => Promise.resolve(stream));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices,
        getUserMedia: mockFnGetUserMedia
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            userAgent: ua
        }
    });
    const mockAddeventListener = jest.fn().mockImplementation((_event, fn) => {
        fn();
    });
    video.srcObject = null;
    video.addEventListener = mockAddeventListener;
    const camera = await new Camera(
        video, {
            mirror: true,
            height: 100
        });
    expect(mockFnEnumerateDevices).toHaveBeenCalled();
});

test('exist navigator.mediaDevices and exist canvas', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices2));
    const mockFnGetUserMedia = jest.fn(() => Promise.resolve(stream));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices,
        getUserMedia: mockFnGetUserMedia
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            userAgent: ua
        }
    });
    const mockAddeventListener = jest.fn().mockImplementation((_event, fn) => {
        fn();
    });
    video.srcObject = null;
    video.addEventListener = mockAddeventListener;
    const camera = await new Camera(
        video, {
            mirror: true,
            height: 100,
            targetCanvas: canvas
        });
    expect(mockFnEnumerateDevices).toHaveBeenCalled();
});

test('exist navigator.getUserMedia', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices2));
    const mockFnGetUserMedia = jest.fn(() => Promise.resolve(stream));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            getUserMedia: mockFnGetUserMedia,
            userAgent: ua
        }
    });
    const mockAddeventListener = jest.fn().mockImplementation((_event, fn) => {
        fn();
    });
    video.srcObject = null;
    video.addEventListener = mockAddeventListener;
    const camera = await new Camera(
        video, {
            height: 100
        });
    expect(mockFnGetUserMedia).toHaveBeenCalled();
});

test('not exist navigator.getUserMedia', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices2));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            getUserMedia: undefined,
            userAgent: ua
        }
    });
    const mockAddeventListener = jest.fn().mockImplementation((_event, fn) => {
        fn();
    });
    video.srcObject = null;
    video.addEventListener = mockAddeventListener;
    const camera = await new Camera(video);
    expect(mockFnEnumerateDevices).toHaveBeenCalled();
});

test('camera start', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockVideoPlay = jest.fn();
    video.play = mockVideoPlay;
    const camera = await new Camera(video);
    await camera.start();
    expect(mockVideoPlay).toHaveBeenCalled();
    await camera.start();
    expect(mockVideoPlay).toHaveBeenCalledTimes(2);
});

test('camera pause', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockVideoPause = jest.fn();
    video.pause = mockVideoPause;
    const camera = await new Camera(video);
    await camera.pause();
    expect(mockVideoPause).toHaveBeenCalled();
});

test('camera switchCameras', async () => {
    const video = document.createElement('video') as HTMLVideoElement;
    const mockFnEnumerateDevices = jest.fn(() => Promise.resolve(devices2));
    const mockFnGetUserMedia = jest.fn(() => Promise.resolve(stream));
    const mediaDevicesMock = {
        enumerateDevices: mockFnEnumerateDevices,
        getUserMedia: mockFnGetUserMedia
    };
    Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
            mediaDevices: mediaDevicesMock,
            userAgent: iosUa
        }
    });
    const mockFnSuccess = jest.fn();
    const mockFnError = jest.fn();
    const camera = await new Camera(
        video, {
            onSuccess: mockFnSuccess,
            onError: mockFnError
        });
    await camera.switchCameras();
    expect(mockFnSuccess).toHaveBeenCalled();
});

