/**
 * file tools/logger logger工具
 * author saniac(snailsword@gmail.com)
 */

export default class Logger {
    constructor() {
        this.timeTable = {};
        this.countTable = {};
        this.duringTable = {};
        this.lastStopTable = {};
    }

    start(key) {
        if (!this.timeTable[key]) {
            this.timeTable[key] = [{}];
        }
        else {
            this.timeTable[key].push({});
        }
        this.timeTable[key][this.timeTable[key].length - 1].startTime = this.time;
        return this;
    }

    end(key) {
        let currentObj = this.timeTable[key][this.timeTable[key].length - 1];
        currentObj.endTime = this.time;
        currentObj.during = currentObj.endTime - currentObj.startTime;
        return this;
    }

    // 数次数
    count(key) {
        if (this.countTable[key]) {
            this.countTable[key]++;
        }
        else {
            this.countTable[key] = 1;
        }
        return this;
    }

    // 看每次执行的时间间隔
    during(key) {
        if (this.lastStopTable[key]) {
            this.duringTable[key].push(this.time - this.lastStopTable[key]);
            this.lastStopTable[key] = this.time;
        }
        else {
            this.lastStopTable[key] = this.time;
            this.duringTable[key] = [];
        }
        return this;
    }

    get time() {
        return +new Date().getTime();
    }
    get statistics() {
        // time
        let timeResult = [];
        let item;
        for (let key in this.timeTable) {
            item = this.timeTable[key];
            let len = item.length;
            let max = 0;
            let min = Number.MAX_VALUE;
            let sum = 0;
            for (let i = 0; i < len; i++) {
                max = Math.max(max, item[i].during);
                min = Math.min(min, item[i].during);
                sum += item[i].during;
            }
            timeResult.push({
                name: key,
                length: len,
                avg: sum / len,
                max,
                min
            });
        }
        console.table(timeResult);
        return {timeResult};
    }
}
