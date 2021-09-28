<template lang="pug">
    div
        el-row(type=flex justify="start" align="middle")
            el-col(:span="8")
                el-row.model-row(align="middle" type="flex")
                    el-col(:span="6")
                        div model:
                    el-col(:span="18")
                        el-select(v-model="modelSeleted" placeHolder="please selete" @change="changeModel")
                            el-option(v-for="(modelItem, index) in modelList" :key="index" :label="modelItem.name" :value="modelItem")
                el-row.model-row(align="middle" type="flex")
                    el-col(:span="6")
                        div run times:
                    el-col(:span="18")
                        el-input(v-model="times" placeHolde="请输入运行次数" @change="getTimes")
                el-button.model-row(type="primary" @click="run") run
            el-col.model-row.model-stage(:span="12")
                el-steps(align-center :space="200" :active="stage" finish-status="success")
                    el-step(title="start")
                    el-step(title="load model")
                    el-step(title="preheat")
                    el-step(title="run model")

        el-row.model-table(type=flex justify="space-between" :gutter="30")
            el-col(:span="7")
                header.model-header general data
                el-table.model-row(:data="tableData" max-height="100%" border)
                    el-table-column(prop="name" label="type")
                    el-table-column(prop="t" label="name")

            el-col(:span="7")
                header.model-header op data
                el-table.model-row(:data="ops" max-height="100%" border)
                    el-table-column(prop="name" label="type")
                    el-table-column(prop="time" label="time")
            el-col.model-detail(:span="7")
                header.model-header details
                //- el-divider(direction="vertical" content-position="left")
                el-table.model-row(:data="progress" max-height="1500" border :row-class-name="tableRowClassName")
                    el-table-column(prop="index" label="index")
                    el-table-column(prop="name" label="name")
                    el-table-column(prop="time" label="time")


</template>

<script lang="ts">
import Vue from 'vue';
import { Runner } from '@paddlejs/paddlejs-core';
import { GLOBALS } from '@paddlejs/paddlejs-core/src/globals';
import '@paddlejs/paddlejs-backend-webgl';
import Utils from './utils';

export default Vue.extend({
    name: 'config',
    data() {
        return {
            modelList:  [
                {
                    name: 'mobileNetV2',
                    feedShape: {
                        fw: 224,
                        fh: 224
                    },
                    fetchShape: [1, 1000, 10, 1],
                    fill: '#fff',
                    needPreheat: false
                },
                {
                    name: 'mobileNetV2Opt',
                    feedShape: {
                        fw: 224,
                        fh: 224
                    },
                    fetchShape: [1, 1000, 10, 1],
                    fill: '#fff',
                    needPreheat: false
                },
                {
                    name: 'wine',
                    feedShape: {
                        fw: 224,
                        fh: 224
                    },
                    fetchShape: [1, 40, 10, 1],
                    fill: '#fff',
                    needPreheat: false
                },
                {
                    name: 'gesture_detect',
                    feedShape: {
                        fw: 256,
                        fh: 256
                    },
                    fetchShape: [1, 1920, 10 , 1],
                    fill: '#fff',
                    needPreheat: false
                },
                {
                    name: 'gesture_rec',
                    feedShape: {
                        fw: 224,
                        fh: 224
                    },
                    fetchShape: [1, 9, 1, 1],
                    fill: '#fff',
                    needPreheat: false
                },
                {
                    name: 'humanseg',
                    feedShape: {
                        fw: 192,
                        fh: 192
                    },
                    fetchShape: [1, 2, 192, 192],
                    fill: '#fff',
                    needPreheat: false
                }
            ],
            modelSeleted: '',
            modelPathPrefix: 'https://paddlejs.cdn.bcebos.com/models/',
            modelPath: '',
            curModel: null,
            progressText: '',
            times: null,
            stage: null,
            loadT: '--',
            preheatT: '--',
            remainOthersT: '--',
            bestT: '--',
            progress: [],
            ops: [],
            paddle: null,
            gl: null,
            test: null,
            opCount: '--'
        }
    },
    computed: {
        tableData(): TableData[] {
            return [
                {name: 'load time', t: this.loadT},
                {name: 'preheat time', t: this.preheatT},
                {name: 'subsequent average time', t: this.remainOthersT},
                {name: 'best time', t: this.bestT},
                {name: 'op count', t: this.opCount || '暂无'}
            ]
        }
    },
    methods: {
        tableRowClassName({row}): string | Boolean {
            return row.name === 'total' && 'detail-index-row';
        },
        // arraySpanMethod({row, columnIndex}) {
        //     return [row.name === 'total' && columnIndex === 0 ? this.opCount: 1, 1];
        // },
        changeModel(value: Row): void {
            // console.log(value);
            this.modelSeleted = value.name;
            this.modelPath = this.modelPathPrefix + value.name;
            // console.log(this.modelPath);
            this.curModel = {...value, modelPath: this.modelPath};
        },
        async loadModel(): Promise<void> {
            this.stage = 1;
            this.progressText = '模型加载中';
            const paddle = this.paddle = new Runner({
                ...this.curModel,
                needPostProcess: false,
                needPreheat: false,
                fileDownload: false,
            });
            const start = Date.now();
            await paddle.init();
            this.loadT = Date.now() - start + '';
            this.stage = 2;

            this.gl = GLOBALS.backendInstance.gl;
        },
        async preheat(): Promise<void> {
            const start = Date.now();
            await this.paddle.preheat();
            this.preheatT = Date.now() - start + '';
            this.stage = 3;
        },
        getTimes(val: string): void {
            if (!val || !this.curModel) {
                return;
            }
        },
        clear(): void {
            this.loadT = '--' ;
            this.preheatT = '--' ;
            this.remainOthersT = '--' ;
            this.bestT = '--' ;
            this.progress = [] ;
            this.ops = [] ;
            this.opCount = '--';
        },
        async predict(): Promise<void> {
            const totalTimes = +this.times;
            let curTimes = 1;
            let remainWholeT = 0;
            let progress = [];
            let totaltimeList = [];
            let opCount = 0;
            const ops = [];
            while(curTimes <= totalTimes) {
                const start = Date.now();
                await this.paddle.execute();
                const t = Date.now() - start;
                remainWholeT += t;
                    // this.remainOthersT = +(remainWholeT / (curTimes - 2).toFixed(4));

                const queryList = GLOBALS.backendInstance.queryList;


                if (queryList && queryList.length) {
                    const quertyResults = this.query(queryList);

                    if (!opCount) {
                        opCount = quertyResults.length;
                    }
                    for (let item of quertyResults) {
                        progress.push({
                            index: curTimes,
                            time: item.time,
                            name: item.name
                        });
                    }

                    ops.push(this.getOpPerf(quertyResults, this.aggregate, {}, true));
                }

                progress.push({
                    index: curTimes,
                    time: t,
                    name: 'total'
                });

                totaltimeList.push(t);
                curTimes++;
            }

            const len = totaltimeList.length;
            totaltimeList.sort((a, b) => a - b);
            this.bestT = totaltimeList[0];

            this.remainOthersT = (remainWholeT / this.times).toFixed(4);
            this.progress = progress;

            if (ops && ops.length) {
                const opInfos = this.getOpPerf(ops, this.merge);
                this.opCount = opCount + '';
                this.ops = Object.keys(opInfos).map(opname => {
                    return {
                        name: opname,
                        time: opInfos[opname].time
                    };
                });
            }

            this.stage = 4;
        },
        async run(): Promise<void> {
            this.clear();
            await this.loadModel();
            await this.preheat();
            await this.predict();
        },
        query(queryList: Query[]): Query[]{
            const result =  queryList.map(item => {
                const {name, query, count} = item;
                const time = Utils.getQueryTime(this.gl, query) / 1000000;
                return {name, count, time: +(time.toFixed(4))};
            })
            return result.filter(item => item.name !== 'feed');
        },
        aggregate(acc: Query, cur: Query): Query {
            const {name, time, count} = cur;
            let now = {...acc};
            if (!acc[name]) {
                now[name] = {time, count};
                return now;
            }

            const item = now[cur.name];
            item.time += time;
            item.count++;
            return now;
        },
        getOpPerf(queryList: Query[], reduceF: any, acc?: Query, needNoMean?: Boolean): any {
            let timeRes = acc ? queryList.reduce(reduceF, acc) : queryList.reduce(reduceF);
            for(let key of Object.keys(timeRes)) {
                const item = timeRes[key];
                const {time, count, name} = item;
                if (name === 'feed') {
                    return item;
                }
                item.time = needNoMean ? time : +(time / count).toFixed(4);
                item.count = 1;
            }
            return timeRes;
        },
        merge(acc: Query, cur: Query): Query {
            for (let name of Object.keys(cur)) {
                const {time, count} = cur[name];
                acc[name].time += time;
                acc[name].count += count;
            }
            return acc;
        }
    }
})
</script>

<style lang="less" scoped>
.model-row {
    margin-top: 20px;
}
.model-stage {
    margin-top: 50px;
}
.model-header {
    text-align: center;
}
.model-table {
    margin-top: 50px;
}
</style>
<style>
.el-table .detail-index-row {
    background-color: #f0f9eb;
}
</style>