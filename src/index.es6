import 'babel-polyfill';
import Runtime from './runtime/runtime';
/**
 * @file 入口文件
 * @author yangmingming
 *
 */
const imgUrl = require('./banana.jpeg');
let floatData;
const promise = Runtime.create(imgUrl);
promise.then(data => {
    console.log('数据长度是：' + data.data.length);
    return Runtime.feed(data.data, {
        w: data.width,
        h: data.height
    });
}).then(data => {
    // 生成feed数据[-1, 3, 227, 227]
    floatData = new Float32Array(data);
    console.log(floatData.length);
});

