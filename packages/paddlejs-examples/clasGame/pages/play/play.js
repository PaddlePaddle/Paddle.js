// pages/play.js
// let gameTimer; // 游戏计时器
import {CONFIG} from '../../config.js';
import {PaddleJS} from '../../lib/paddleRegister';
import {shuffle} from '../../utils/util';

const app = getApp();

Component({
	options: {
        pureDataPattern: /^_/
    },
	data: {
		loading: true,
		timerStatus: 'pause', // start continue pause 
		gameTime: CONFIG.config.modelInfo.gameTime,
		gameStatus: '', // 游戏状态：prepare 准备中 start 识别中
		currentIdx: '',
		targetIdx: 0,
		score: 0,

		startCountdown: false,

		isMatch: false,
		startGame: false,
		cameraBack: true,

		preloadImgList: [],

		_cameraFirstInitFlag: false,
		_quesIndex: 0,
		_cameraFrameMax: 30, // 视频帧截流
		_timerStartFlag: false, // timer是否开启标志位
	},
	created() {
		const context = wx.createCameraContext();
		let count = 0;
		let itemMap = CONFIG.config.modelInfo.itemMap;
		const listener = context.onCameraFrame(frame => {
			if (this.data.timerStatus === 'pause') {
				return;
			}
			if (count < this.data._cameraFrameMax) {
				// 截流
				count++;
				return;
			}
			// 预测
			PaddleJS.predict(frame).then(res => {
				let idx = this.getMaxItem(res) + '';
				console.log(idx, itemMap[idx].name );
				if (itemMap[idx].name === itemMap[this.data.targetIdx].name) {
					this.setData({
						isMatch: true
					});
					app.globalData.recognizeSuccessList.push(idx);
				}
				this.setData({currentIdx: idx});
			});
			count = 0;
		});
		listener.start();
		CONFIG.config.modelInfo.quesList = shuffle(CONFIG.config.modelInfo.quesList);
	},
	attached() {
		let preloadImgList = Object.values(CONFIG.config.modelInfo.itemMap).map(item => {
			return CONFIG.config.modelInfo.itemsIconUrlPrefix + item.iconFilename;
		})
		this.setData({preloadImgList});
	},
	observers: {
		isMatch(val) {
			if (val) {
				// 匹配成功
				this.setData({
					timerStatus: 'pause',
					score: this.data.score + 5
				});
			}
		}
	},
	methods: {
		getMaxItem(datas = []) {
    		const max = Math.max.apply(null, datas);
    		const index = datas.indexOf(max);
    		return index;
		},
		switchCamera() {
			this.setData({
				cameraBack: !this.data.cameraBack
			});
		},
		// 倒计时结束后 开启游戏
		startGame() {
			this.setData({
				startGame: true,
				targetIdx: CONFIG.config.modelInfo.quesList[this.data._quesIndex]
			});
		},
		// 打开计时
		turnOnTimer() {
			// 开始识别 打开计时
			if (this.data._timerStartFlag) {
				this.setData({
					timerStatus: 'continue'
				});
				return;
			}
			this.setData({
				timerStatus: 'start'
			});
			this.data._timerStartFlag = true;
		},
		nextItem() {
			// 切换下一个题目
			if (this.data._quesIndex + 1 === CONFIG.config.modelInfo.quesList.length) {
				this.data._quesIndex = 0;
			}
			this.data._quesIndex++;
			this.setData({
				timerStatus: 'pause',
				isMatch: false,
				targetIdx: CONFIG.config.modelInfo.quesList[this.data._quesIndex]
			});
		},
		// 相机初始化完毕
		cameraInitdone() {
			// camera 的 bindinitdone 只会在真机上触发 开发机上不行
 			if (!this.data._cameraFirstInitFlag) {
				// 相机首次初始化完成时刻
				this.setData({
					loading: false,
					startCountdown: true
				});
				this.data._cameraFirstInitFlag = true;
				return;
			}
		},
		// 相机出错
		cameraError() {
			wx.wx.showToast({
				title: '出错了，请重试',
				icon: 'error',
				duration: 1500,
				mask: true,
			});
			setTimeout(() => {
				wx.navigateBack();
			}, 1200);
		},
		// 相机非正常终止时触发
		cameraUnexpectedStop() {
			wx.wx.showModal({
				title: '注意',
				content: '相机意外关闭',
				showCancel: false,
				confirmText: '了解',
				confirmColor: '#07C160',
				success: (result) => {},
				fail: ()=>{},
				complete: ()=>{}
			});
		},
		navToFinal() {
			wx.redirectTo({
				url: `../final/final?itemsNum=${this.data.score / 5}`
			});
		},

		// 测试函数
		success() {
			this.setData({
				timerStatus: 'pause',
				isMatch: true,
				score: this.data.score + 5
			});
		},
	}

})