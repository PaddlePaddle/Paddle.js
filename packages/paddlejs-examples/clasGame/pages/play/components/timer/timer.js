// pages/play/components/timer/timer.js
import Timer from '../../../../lib/Timer';

Component({
    options: {
        styleIsolation: 'apply-shared',
        pureDataPattern: /^_/
    },
    properties: {
        gameTime: {
            type: Number,
            default: 0
        },
        timerStatus: {
            type: String,
            default: ''
        }
    },
    data: {
	    isPaused: false,
	    counter: '',
        isRemind: false,
        _gameTimer: null
	},
    observers: {
        timerStatus(val) {
            let gameTimer = this.data._gameTimer;
            if (!gameTimer) {
                return;
            }
            switch(val) {
                case 'start':
                    gameTimer.start();
                    break;
                case 'pause':
                    gameTimer.pause();
                    break;
                case 'continue':
                    gameTimer.continue();
                    break;
            }
        }
    },
    attached() {
		this.data._gameTimer = new Timer({
			duration: this.data.gameTime,
			intervalCallBack: time => {
				// 间隔回调
				this.setData({
					counter: time
				});
                if (time === 5) {
                    this.setData({
                        isRemind: true
                    });
                }
			},
			endCallback: () => {
				// 结束回调
                this.triggerEvent('endGame');
			}
		});
        this.setData({
			counter: this.data.gameTime
		});
	},
    detached() {
        // 销毁定时器setInterval
        this.data._gameTimer.destory();
    }
})
