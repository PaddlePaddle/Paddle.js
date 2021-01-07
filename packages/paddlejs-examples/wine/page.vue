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
import 'regenerator-runtime/runtime';
import map from './data/wine.map.json';
import * as mobilenet from '@paddlejs-models/mobilenet';

export default {
    data() {
        return {
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
            isPredicting: false
        }
    },
    methods: {
        change(index) {
            this.curImgIndex = index;
        },
        async predict() {
            this.autoPlay = false;
            this.isPredicting = true;
            const curIndex = this.curImgIndex;
            const imgDom = this.$refs['img' + this.curImgIndex][0];
            await this.predictModel(imgDom, curIndex);
            this.isPredicting = false;
        },
        async load() {
            const path = 'https://paddlejs.cdn.bcebos.com/models/wine';
            await mobilenet.load({
                path,
                fileCount: 3,
                mean: [0.485, 0.456, 0.406],
                std: [0.229, 0.224, 0.225]
            }, map);
            this.isLoading = false;
        },
        async predictModel(img, curIndex) {
            const res = await mobilenet.classify(img);
            this.result[curIndex] = res || '无结果';
        }
    },
    mounted() {
        this.load();
    }
}
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
.result-text {
    font-weight: bold;
}
</style>
