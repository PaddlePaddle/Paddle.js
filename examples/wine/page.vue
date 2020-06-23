<template lang="pug">
    div.page
        div.imglist
            el-carousel(:interval="4000" type="card" @change="change" height="400px" :autoplay="autoPlay")
                el-carousel-item(v-for="(item, index) in imgList" :key="item")
                    img.img(:src="item" :ref="'img' + index")
                    span.result-text(v-if="result[index]") {{ result[index] }}

        el-button(type="primary" @click="predict").predict 点击识别此图

        div.loading(v-if="isLoading || isPredicting")
            span.loading-text {{ isLoading ? 'loading...' : '识别中……'}}



</template>

<script>
import Vue from 'vue';
import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import Paddlejs from '../../src/executor/runner';
import Utils from '../../src/utils/utils';
import postProcess from './postProcess'
export default Vue.extend({
    data() {
        return {
            modelConf: {
                modelPath: 'https://paddlejs.cdn.bcebos.com/models/wine',
                fileCount: 3,
                feedShape: {
                    fw: 224,
                    fh: 224
                },
                fetchShape: [1, 40, 1, 1],
                fill: '#000',
                scale: 256,
                targetSize: { height: 224, width: 224 },
                mean: [0.485, 0.456, 0.406],
                std: [0.229, 0.224, 0.225],
                needBatch: true
            },
            imgList: [
                require('./imgs/1.jpg'),
                require('./imgs/2.jpg'),
                require('./imgs/3.jpg'),
                require('./imgs/4.jpg'),
                require('./imgs/5.jpg'),
                require('./imgs/6.jpg'),
                require('./imgs/7.jpg')
            ],
            result: {},
            curImgIndex: 0,
            autoPlay: true,
            isLoading: true,
            isPredicting: false,
            paddlejs: null
        }
    },
    methods: {
        change(index) {
            this.curImgIndex = index;
        },
        async predict() {
            console.log('开始预测')
            this.autoPlay = false;
            this.isPredicting = true;
            const curIndex = this.curImgIndex;
            const imgDom = this.$refs['img' + this.curImgIndex][0];
            await this.predictModel(imgDom, curIndex);
            this.isPredicting = false;

        },
        load() {
            const paddlejs = this.paddlejs = new Paddlejs(this.modelConf);
            paddlejs.loadModel().then(() => {
                this.isLoading = false;
            })
        },
        async predictModel(img, curIndex) {
            await this.paddlejs.predict(img, (data) => this.process(data, curIndex));
        },
        process(data, curIndex) {
            const result = postProcess(data);
            console.log(result)
            this.result[curIndex] = result || '无结果'
        }
    },
    mounted() {
        this.load();
    }
})
</script>

<style>
.page {
    padding-top: 50px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #f1f1f1;
}
.img {
    width: 100%;
}
.loading {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    z-index: 2;
    font-size: 32px;
}
.imglist {
    margin-bottom: 50px;
}
.predict {
}
.result-text {
    font-weight: bold;
}
</style>