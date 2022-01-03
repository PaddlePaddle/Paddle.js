// components/top-bar/top-bar.js
// eslint-disable-next-line no-undef
const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
// eslint-disable-next-line no-undef
const menuButtonLayoutInfo = wx.getMenuButtonBoundingClientRect();

// eslint-disable-next-line no-undef
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        paddingTop: statusBarHeight,
        height: (menuButtonLayoutInfo.height + (menuButtonLayoutInfo.top - statusBarHeight) * 2)
    }
});
