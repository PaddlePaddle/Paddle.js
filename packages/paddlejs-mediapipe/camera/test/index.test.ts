import Camera from '../src/index';

let video = document.createElement('video') as any;
let video1 = document.createElement('video') as any;
let video2 = document.createElement('video') as any;

// video.srcObject = null;

// 创建mock函数
const mockFn1 = jest.fn().mockResolvedValue('');

const mockFn2 = jest.fn();

const mockFn3 = jest.fn();

Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
        enumerateDevices: mockFn1,
        getUserMedia: mockFn1
    }
});

Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'iphone'
});

const deviceInfos = [
    {
        deviceId: 'd7f3e03a5a257dbf6971d0dcbab6500a551dcbcc504e23a8b551bf1fbe810ce3',
        groupId: '463296e5a120f9e9eed4377098a3f36f88fdee953c3e570dc162069ebd865b82',
        kind: 'videoinput',
        label: 'FaceTime高清摄像头（内建） (05ac:8514)'
    }
];

const stream = {
    active: true,
    id: "WXtVeM6aEr9l1Gglb7rcJP9dWlMfaSGyiCQz",
    onactive: null,
    onaddtrack: null,
    oninactive: null,
    onremovetrack: null
};

let camera = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: video,
    constraints: {
        video: true
    }
});

let camera1 = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: video1,
    width: 200
});

let camera2 = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: video2,
    height: 300
});

let camera3 = new Camera({
    // 用来显示摄像头图像的dom
    videoDom: video,
    constraints: {
        video: true
    },
    deviceInfos
});

test('camera constructor', () => {
    console.log(camera, 'camera');
    const innerWidth = window.innerWidth;
    expect(video.width).toBe(innerWidth);
    expect(video1.width).toBe(200);
    expect(video2.height).toBe(300);
});

test('called getDevices', () => {
    /* 获取摄像头 */
    camera3.getDevices();
    expect(mockFn1).toHaveBeenCalled();
});

test('called run', () => {
    window.alert = () => {};
    camera3.run(deviceInfos[0].deviceId, mockFn2);
    expect(mockFn1).toHaveBeenCalled();
});

test('called run not exist mediaDevices', () => {
    Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: undefined
    });
    camera3.run(deviceInfos[0].deviceId, mockFn2);
    expect(mockFn1).toHaveBeenCalled();
});

test('called run exist webkitGetUserMedia', () => {
    Object.defineProperty(navigator, 'webkitGetUserMedia', {
        writable: true,
        value: mockFn2
    });
    Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: undefined
    });
    let camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video,
        constraints: {
            video: true
        },
        deviceInfos
    });
    camera.run(deviceInfos[0].deviceId, mockFn2);
    expect(mockFn2).toHaveBeenCalled();
});

test('called run exist mozGetUserMedia', () => {
    Object.defineProperty(navigator, 'mozGetUserMedia', {
        writable: true,
        value: mockFn2
    });
    Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: undefined
    });
    Object.defineProperty(navigator, 'webkitGetUserMedia', {
        writable: true,
        value: undefined
    });
    let camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video,
        constraints: {
            video: true
        },
        deviceInfos
    });
    camera.run(deviceInfos[0].deviceId, mockFn2);
    expect(mockFn2).toHaveBeenCalled();
});

test('called run exist getUserMedia', () => {
    Object.defineProperty(navigator, 'getUserMedia', {
        writable: true,
        value: mockFn2
    });
    Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: undefined
    });
    Object.defineProperty(navigator, 'webkitGetUserMedia', {
        writable: true,
        value: undefined
    });
    Object.defineProperty(navigator, 'mozGetUserMedia', {
        writable: true,
        value: undefined
    });
    let camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video,
        constraints: {
            video: true
        },
        deviceInfos
    });
    camera.run(deviceInfos[0].deviceId, mockFn2);
    expect(mockFn2).toHaveBeenCalled();
});

test('called success', () => {
    video.srcObject = null;
    video.play = () => {};
    const documentLoadedEvent = new Event('loadeddata');

    let camera = new Camera({
        // 用来显示摄像头图像的dom
        videoDom: video,
        constraints: {
            video: true
        },
        deviceInfos
    });
    camera.success(stream, mockFn3);
    video.dispatchEvent(documentLoadedEvent);
    expect(mockFn3).toHaveBeenCalledTimes(1);
});







