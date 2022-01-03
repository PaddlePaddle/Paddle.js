// index.js
import { authorize } from '../../utils/util.js';
import { CONFIG } from '../../config.js';

// eslint-disable-next-line no-undef
const app = getApp();

// eslint-disable-next-line no-undef
Component({
    options: {
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    data: {
        CONFIG: CONFIG,
        isLoaded: false, // 模型是否加载完毕
        titleEntranceAniName: '',
        titleBgUrl: '',
        _titleAniStpOneDuration: 500
    },
    created() {
        // 监听预热标志位 preheatDone，赋值 loaded
        app.watchGlobalData('preheatDone', val => {
            this.setData({ isLoaded: val });
        });
        authorize('camera');
    },
    attached() {
        /**
         * 这里再次赋值是为了兼容 在已经进入一次小程序后 退出但不杀进程 重新扫码再次进入
         * 小程序不会执行app.onLanuch 因此不会执行预热过程 不会给preheatDone赋值 不会触发app.watchGlobalData('preheatDone') 注册的回调
         * 导致isLoaded 不会翻转
         */
        this.setData({ isLoaded: app.globalData.preheatDone });
        setTimeout(() => {
            this.setData({
                titleEntranceAniName: 'animate__zoomIn',
                titleBgUrl: 'https://mms-voice-fe.cdn.bcebos.com/pdproject/clas/wx-project/title_logo_2109011341.png'
            });
            setTimeout(() => {
                this.setData({ titleEntranceAniName: 'animate__bounce' });
            }, this.data._titleAniStpOneDuration);
        }, 800);
    },
    methods: {
        navToPlay() {
            // 申请相机权限
            authorize('camera')
                .then(() => {
                    // eslint-disable-next-line no-undef
                    wx.navigateTo({
                        url: '../play/play'
                    });
                })
                .catch(() => {
                    // eslint-disable-next-line no-undef
                    wx.showToast({
                        title: '出错了，请重试',
                        icon: 'error',
                        duration: 2000,
                        mask: true
                    });
                });
        }
    }
});
