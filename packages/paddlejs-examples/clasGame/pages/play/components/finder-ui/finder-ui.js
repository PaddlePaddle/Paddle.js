// pages/play/components/finder-ui/finder-ui.js
import { CONFIG } from '../../../../config.js';

let showTimer = null;

// eslint-disable-next-line no-undef
Component({
    options: {
        styleIsolation: 'apply-shared',
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    properties: {
        targetIdx: {
            type: String,
            default: ''
        },
        currentIdx: {
            type: String,
            default: ''
        },
        isMatch: {
            type: Boolean,
            default: false
        }
    },
    data: {
        showTargetItem: false,
        showTips: false,
        CONFIG: CONFIG,
        _showTargetDuration: 1500, // 展示下一个物品延时
        _matchShowDuration: 1000 // 匹配成功展示延时
    },
    observers: {
        targetIdx(val) {
            // 传入新的目标物品 展示4s
            // 需要考虑是否是最后一个物品  定时器干掉
            if (val) {
                this.setData({
                    showTargetItem: true
                });
                // 下一个时候需要取消定时器
                showTimer = setTimeout(() => {
                    clearTimeout(showTimer);
                    showTimer = null;
                    this.setData({
                        showTargetItem: false
                    });
                    this.triggerEvent('startRecognize');
                }, this.data._showTargetDuration);
            }
        },
        isMatch(val) {
            if (val) {
                setTimeout(() => {
                    this.nextItem();
                }, this.data._matchShowDuration);
            }
        }
    },
    methods: {
        navBack() {
            // eslint-disable-next-line no-undef
            wx.navigateBack();
        },
        nextItem() {
            this.triggerEvent('nextItem');
        }
    }
});
