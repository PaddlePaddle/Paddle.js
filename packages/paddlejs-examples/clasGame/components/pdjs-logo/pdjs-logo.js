// components/common/logo/logo.js
Component({
    options: {
        // 对于自定义组件 如需使用app.wxss样式 需要配置样式穿透选项
        styleIsolation: 'apply-shared'
    },
    properties: {
        poweredByText: {
            type: String,
            value: 'Paddle'
        },
        poweredByLink: {
            type: String,
            value: 'https://www.paddlepaddle.org.cn/'
        }
    },
    methods: {
        navToWebview(event) {
            let src = event.currentTarget.dataset.src;
            wx.navigateTo({
				url: `../webview/webview?src=${src}`
			})
        }
    }
})
