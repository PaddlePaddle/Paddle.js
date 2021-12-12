// components/img-preloader/img-preloader.js
Component({
    options: {
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    properties: {
        imgList: {
            type: Array,
            value: []
        },
    },
    data: {
        src: '',
        _idx: 0
    },
    observers: {
        'imgList[0]': function(val) {
            if (val) {
                this.setData({
                    src: val
                });
                this.data._idx = 0;
            }
        }
    },
    methods: {
        // 预处理图片  发现进入新页面就会重新请求 不会复用
		loadImg() {
			this.data._idx++;
			if (this.data._idx >= this.data.imgList.length) {
				console.log('图片加载完成');
                this.triggerEvent('imgPreloadDone');
				return;
			}
			this.setData({
				src: this.data.imgList[this.data._idx]
            });
		}
    }
})
