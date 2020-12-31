import 'babel-polyfill';
import Runner from '../../src/executor/runner';
import postProcess from './util';

/**
 * @file model demo 入口文件
 * @author wangqun@baidu.com
 *
 */
// 模型输出shape
const outputShape = {
    from: [10, 10, 25, 1],
    to: [10, 10, 5, 5]
}
// 模型feed数据
const fw = 320;
const fh = 320;
const feedShape = {fw, fh};
// 模型路径
// 统计参数
const paddlejs = new Runner({
    // 用哪个模型
    fileCount: 1,
    modelPath: 'https://paddlejs.cdn.bcebos.com/models/tinyYolo',
    fill: '#000', // 缩放后用什么填充不足方形部分
    targetSize: {
        height: fw,
        width: fh
    },
    targetShape: [1, 3, fw, fh], // 目标形状 为了兼容之前的逻辑所以改个名
    feedShape,
    fetchShape: [1, 25, 10, 10],
    mean: [117.001 / 255, 114.697 / 255, 97.404 / 255], // 预设期望
    std: [1, 1, 1],
    needBatch: true,
    needPostProcess: false
});

paddlejs.loadModel();

function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (evt) {
        let img = document.getElementById('image');
        img.src = evt.target.result;
        img.onload = function() {
            paddlejs.predict(img, (data) => {
                postProcess(data, img, fw, outputShape);
            });
        };
    }
    reader.readAsDataURL(file.files[0]);
}
// selectImage
document.getElementById("uploadImg").onchange = function () {
    selectImage(this);
};

