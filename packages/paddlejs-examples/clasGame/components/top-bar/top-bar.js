// components/top-bar/top-bar.js
const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
const menuButtonLayoutInfo = wx.getMenuButtonBoundingClientRect();

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        paddingTop: statusBarHeight,
        height: (menuButtonLayoutInfo.height + (menuButtonLayoutInfo.top - statusBarHeight) * 2)
    }
})
