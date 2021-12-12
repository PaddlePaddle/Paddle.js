// pages/play/components/start-animation/start-animation.js
import Timer from '../../../../lib/Timer';
let startCountdownTimer = null;

Component({
    options: {
        styleIsolation: 'apply-shared',
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    properties: {
        startCountdown: {
            type: Boolean,
            default: false
        }
    },
    data: {
        count: 3,
        start: false, // 控制组件展示
        showCountdownAni: true, // 切换倒计时动画 | GO动画
        countdownEntranceAni: false, // 控制倒计时入场动画
        countdownExitAni: false, // 控制倒计时退场动画
        GOExitAni: false, // 控制GO退出动画

        _startDuration: 500, // 过度延时 ms
        _countdownEntranceAniDuration: 700, // 倒计时动画进场延时 ms
        _countdownExitAniDuration: 300, // 倒计时动画退场延时 ms
        _GOEntranceAniDuration: 300, // GO进场动画延时 ms
        _GOExitAniDuration: 300 // GO退场动画延时 ms
    },
    observers: {
        startCountdown(val) {
            if (val) {
                setTimeout(() => {
                    startCountdownTimer.start();
                    this.setData({
                        start: true,
                        countdownEntranceAni: true
                    });
                }, this.data._startDuration);
            }
        },
        countdownEntranceAni(val) {
            if (val) {
                // 执行入场动画
                setTimeout(() => {
                    this.setData({
                        countdownEntranceAni: false,
                        countdownExitAni: true
                    });
                }, this.data._countdownEntranceAniDuration);
            }
        },
        countdownExitAni(val) {
            if (val) {
                // 执行退场动画
                setTimeout(() => {
                    this.setData({
                        countdownExitAni: false,
                        countdownEntranceAni: true
                    });
                }, this.data._countdownExitAniDuration);
            }
        }
    },
    attached() {
        startCountdownTimer = new Timer({
			duration: 3,
            interval: this.data._countdownEntranceAniDuration + this.data._countdownExitAniDuration, // 间隔时间为倒计时入场退场延时之和
			intervalCallBack: time => {
				// 间隔回调
				if  (time === 0) {
                    return;
                }
                this.setData({
					count: time
				});
			},
			endCallback: () => {
				// 结束回调
                this.setData({showCountdownAni: false});
                setTimeout(() => {
                    // 执行GO退场动画
                    this.setData({GOExitAni: true});
                    // 结束事件
                    setTimeout(() => {
                        this.triggerEvent('startGame');
                    }, this.data._GOExitAniDuration);
                }, this.data._GOEntranceAniDuration + 300);
			}
		});
    }
})
