// 强制获取某权限
const authorize = scopeName => {
    // eslint-disable-next-line no-undef
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    return new Promise((resolve, reject) => {
        const scope = 'scope.' + scopeName;
        // eslint-disable-next-line no-undef
        wx.getSetting({
            success(res) {
                if (res.authSetting[scope]) {
                    // 已拥有该权限
                    // eslint-disable-next-line no-undef
                    wx.hideLoading();
                    resolve();
                    return;
                }
                // 请求权限
                // eslint-disable-next-line no-undef
                wx.authorize({
                    scope,
                    success() {
                        // 获取权限成功
                        resolve();
                    },
                    fail() {
                        // 获取权限失败
                        // eslint-disable-next-line no-undef
                        wx.showModal({
                            title: '权限申请',
                            content: '该小程序需要使用您以下权限',
                            cancelText: '取消',
                            cancelColor: '#999',
                            confirmText: '前往',
                            confirmColor: '#07C160',
                            success(res) {
                                if (res.confirm) {
                                    // eslint-disable-next-line no-undef
                                    wx.openSetting();
                                }
                                else if (res.cancel) {
                                    authorize(scopeName);
                                }
                            },
                            fail() {
                                reject(new Error('获取权限失败'));
                            }
                        });
                    },
                    complete() {
                        // eslint-disable-next-line no-undef
                        wx.hideLoading();
                    }
                });
            },
            fail() {
                reject(new Error('获取设置失败'));
            }
        });
    });
};

const shuffle = arr => {
    for (let i = arr.length - 1; i >= 0; i--) {
        const rIndex = Math.floor(Math.random() * (i + 1));
        const temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
};

module.exports = {
    authorize,
    shuffle
};
