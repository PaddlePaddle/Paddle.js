/**
 * 定时器类 做倒计时用
 * 支持 暂停、启动、返回剩余时间
 */
export default class Timer {
    constructor(timerOptions) {
        // 参数解构
        let {
            duration = 1,
            interval = 1000,
            intervalCallBack = null,
            endCallback = null
        } = timerOptions;
        
        // 赋值
        this._time = duration;
        this._intervalId = null;
        this._interval = interval;
        
        // 状态参数
        this._isPaused = false;

        // 回调注册
        this._intervalCallBack = intervalCallBack;
        this._endCallback = endCallback;

    }

    get time() {
        return this._time;
    }
    set time(val) {
        return;
    }

    reset(duration) {
        clearInterval(this._intervalId);
        this._intervalId = null;
        // 清除当前定时器
        this._time = duration || 1;
    }

    start() {
        // 开始
        if (this._intervalId) {
            return;
        }
        this._intervalId = setInterval(() => {
            // debugger;
            if (this._isPaused) {
                return;
            }
            this._time--;
            this._intervalCallBack && this._intervalCallBack(this._time);
            if (this._time === 0) {
                // 结束
                clearInterval(this._intervalId);
                this._intervalId = null;
                this._endCallback && this._endCallback(); // 计时结束回调
            }
        }, this._interval);
    }

    pause() {
        // 暂停 | 启动
        if (this._intervalId) {
            this._isPaused = true;
            return;
        }
        console.log('暂停无效');
    }
    
    continue() {
        if (this._intervalId) {
            this._isPaused = false;
            return;
        }
        console.log('重启无效');
    }

    destory() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
    }
}