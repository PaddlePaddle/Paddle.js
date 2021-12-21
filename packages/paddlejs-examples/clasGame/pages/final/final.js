// pages/final/final.js
import { CONFIG } from '../../config.js';

// eslint-disable-next-line no-undef
const app = getApp();

// eslint-disable-next-line no-undef
Component({
    options: {
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    properties: {
        itemsNum: Number,
        default: 0
    },
    data: {
        loading: true,
        itemWidth: 0,
        _itemColNum: 0,
        _itemRowNum: 0,
        modelInfo: CONFIG.config.modelInfo,
        urlPrefix: CONFIG.config.modelInfo.itemsIconUrlPrefix,
        foundList: []
    },
    attached() {
        this.setData({
            foundList: app.globalData.recognizeSuccessList
        });
        let c = 1;
        let r = 0;
        do {
            if (c === r) {
                c++;
            }
            else {
                r = c;
            }
        } while (c * r < this.data.foundList.length);
        this.data._itemColNum = c;
        this.data._itemRowNum = r;
        const width = 80 / this.data._itemColNum;
        const height = 60 / this.data._itemRowNum;
        this.setData({
            itemWidth: width > height ? height : width
        });
        setTimeout(() => {
            this.setData({
                loading: false
            });
        }, 800);
    },
    detached() {
        app.globalData.recognizeSuccessList = [];
    },
    methods: {
        navToPlay() {
            // eslint-disable-next-line no-undef
            wx.redirectTo({
                url: '../play/play'
            });
        }
    }
});
