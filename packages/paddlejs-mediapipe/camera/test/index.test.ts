import Camera from '../src/index';

let video = document.createElement('video');

test('camera constructor not exist navigator.getUserMedia', () => {
    const mockFnNotSupported = jest.fn();
    let camera = new Camera(
        // 用来显示摄像头图像的dom
        video, {
            width: 100,
            height: 100,
            onNotSupported: mockFnNotSupported
        });
    expect(video.width).toBe(100);
    expect(mockFnNotSupported).toHaveBeenCalled();
});

test('camera constructor exist navigator.getUserMedia', () => {
    const mockFnGetUserMedia = jest.fn();
    // @ts-ignore
    window.URL = 'xxx';
    Object.defineProperty(navigator, 'getUserMedia', {
        writable: true,
        value: mockFnGetUserMedia
    });
    let camera = new Camera(
        // 用来显示摄像头图像的dom
        video, {
            width: 100,
            height: 100
        });
    expect(mockFnGetUserMedia).toHaveBeenCalled();
});







