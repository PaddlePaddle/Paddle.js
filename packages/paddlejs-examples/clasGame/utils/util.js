// 强制获取某权限
const authorize = (scopeName) => {
	wx.showLoading({
		title: '加载中',
		mask: true
	});
	return new Promise((reslove, reject) => {
		let scope = 'scope.' + scopeName;
		wx.getSetting({
			success(res) {
				if (res.authSetting[scope]) {
					// 已拥有该权限
					wx.hideLoading();
					reslove();
					return;
				}
				// 请求权限
				wx.authorize({
					scope,
					success() {
						// 获取权限成功
						reslove();
					},
					fail() {
						// 获取权限失败
						wx.showModal({
							title: '权限申请',
							content: '该小程序需要使用您以下权限',
							cancelText: '取消',
							cancelColor: '#999',
							confirmText: '前往',
							confirmColor: '#07C160',
							success (res) {
								if (res.confirm) {
									wx.openSetting();
								}
								else if (res.cancel) {
									authorize(scopeName);
								}
							},
							fail() {
								reject();
							}
						});
						
					},
					complete() {
						wx.hideLoading();
					}
				});
			},
			fail() {
				reject();
			}
		});
	});
}

const shuffle = (arr) => {
	for (let i = arr.length - 1; i >= 0; i--) {
        let rIndex = Math.floor(Math.random()*(i+1));
        let temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

module.exports = {
	authorize,
	shuffle
}
