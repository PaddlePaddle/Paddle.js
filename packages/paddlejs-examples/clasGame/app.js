// app.js
import { CONFIG } from "./config";
import { PaddleJS } from './lib/paddleRegister';

App({
	onLaunch() {
		// 初始化云函数
		wx.cloud.init({env: 'production-5g6aei64eb3586fc'});

		wx.cloud.callFunction({
			name: 'getConfig',
			data: {modelName: 'clas-model-info'},
			complete: res => {
				console.log(res);
				if (res.result
					&& res.result.status === 0
					&& res.result.data.modelInfo
				) {
					CONFIG.config.modelInfo = res.result.data.modelInfo;
				}
				console.log(CONFIG);
				setTimeout(() => {
					PaddleJS.init().then(res => {
						console.log('预热数据', res);
						this.globalData.preheatDone = true;
					});
				}, 500);
				// 请求失败用 config.js 默认数据
			}
		});
	},
	globalData: {
		_preheatDone: false,
		preheatDone: false,
		recognizeSuccessList: []
	},
	watchGlobalData(watchProperty, watchCallback) {
		let globalData = this.globalData;
		// 通过拦截全局对象属性set get 方法 插入监听全局变量的回调
		Object.defineProperty(globalData, watchProperty, {
			configurable: true,
      		enumerable: true,
			set: value => {
				this.globalData['_' + watchProperty] = value;
				// callback
				watchCallback(value);
			},
			get: () => {
				return this.globalData['_' + watchProperty];
			}
		});
	}

})
