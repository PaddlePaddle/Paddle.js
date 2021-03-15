/**
 * @file 视频流类
 * @author xxx
 */

interface cameraOption {
    width?: number;
    height?: number;
    /** 是否镜像 */
    mirror?: boolean;
    /** 目标canvas DOM对象 */
    targetCanvas?: HTMLCanvasElement;
    onSuccess?: () => void;
    onError?: NavigatorUserMediaErrorCallback;
    onNotSupported?: () => void;
    onFrame?: (canvas: HTMLCanvasElement) => void;
}

export default class Camera {
    constructor(videoElement: HTMLVideoElement, opt: Partial<cameraOption> = {}) {
        this.video = videoElement;
        this.options = Object.assign({}, this.defaultOption, opt);
        this.currentConstraints = 'user';
        this.cameraNum = 0;
        this.initVideoStream();
    }

    private noop = () => {};
    /** 默认配置对象 */
    private defaultOption: cameraOption = {
        mirror: false,
        targetCanvas: <any>null,
        onSuccess: this.noop,
        onError: this.noop,
        onNotSupported: this.noop,
        onFrame: this.noop
    };

    private options: cameraOption;
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private requestAnimationId;
    private stream: any;
    private currentConstraints: string;
    private cameraNum: number;

    private initVideoStream() {
        this.video.width = this.options.width || this.video.clientWidth;
        if (this.options.height) {
            this.video.height = this.options.height;
        }
        // 枚举设备摄像头
        this.enumerateDevices();
        // 处理视频流
        this.handleStream();
    }

    private handleStream() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: {
                    facingMode: this.currentConstraints
                }}).then(stream => {
                this.stream = stream;
                this.streamCallback();
            }).catch(this.options.onError);
            return;
        }
        // @ts-ignore
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: {
                    facingMode: this.currentConstraints
                }}, stream => {
                this.stream = stream;
                this.streamCallback();
            }, this.options.onError);
            return;
        }
        this.options.onNotSupported();
    }

    private enumerateDevices() {
        navigator.mediaDevices && navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'videoinput') {
                        this.cameraNum++;
                    }
                });
            })
            .catch(err => {
                console.log(err.name + ': ' + err.message);
            });
    }

    private streamCallback() {
        this.options.onSuccess();
        // @ts-ignore
        const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        if ('srcObject' in this.video) {
            try {
                this.video.srcObject = this.stream;
            } catch (error) {
                this.video.src = URL.createObjectURL(this.stream) || this.stream;
            }
        }
        this.video.addEventListener('loadeddata', () => {
            // 设置视频流高度
            if (this.options.height) {
                this.video.width = this.video.clientWidth;
            }
            else {
                this.video.height = this.video.clientHeight;
            }
            this.initCanvas();
        });
    }

    private stopMediaTracks() {
        this.stream?.getTracks()?.forEach(track => {
            track.stop();
        });
    }

    private initCanvas() {
        this.canvas = this.options.targetCanvas || document.createElement('canvas');
        this.canvas.width = this.video.width;
        this.canvas.height = this.video.height;
        this.context = this.canvas.getContext('2d');
        // mirror video
        if (this.options.mirror) {
            this.context.translate(this.canvas.width, 0);
            this.context.scale(-1, 1);
        }
    }

    private videoRequestAnimationFrame() {
        const drawImage = () => {
            this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);
            this.options.onFrame(this.canvas);
            this.requestAnimationId = requestAnimationFrame(drawImage);
        };
        this.requestAnimationId = requestAnimationFrame(drawImage);
    }

    public start() {
        this.video.play();
        if (this.requestAnimationId) {
            return;
        }
        this.videoRequestAnimationFrame();
    }

    public stop() {
        this.pause();
        this.video.src = '';
    }

    public pause() {
        if (this.requestAnimationId) {
            cancelAnimationFrame(this.requestAnimationId);
            this.requestAnimationId = null;
        }
        this.video.pause();
    }

    public switchCameras() {
        if (this.cameraNum < 2) {
            return;
        }
        // 停止视频流播放
        this.stopMediaTracks();
        // 切换摄像头
        this.currentConstraints = 'user' ? 'environment' : 'user';
        // 重置视频流
        this.handleStream();
    }
}
