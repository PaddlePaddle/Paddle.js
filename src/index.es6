import 'babel-polyfill';
import Runtime from './runtime/runtime';
/**
 * @file 入口文件
 * @author yangmingming
 *
 */
const shapeA = [1, 3, 256, 256];
const shapeB = [3];
const imgUrl = require('./banana.jpeg');
let shapeAData;
let shapeBData;
let inst;

const matrix = Runtime.mockOrigin();
const filter = Runtime.mockFilter();
// 原始张量，上下左右1个单位的padding，步长是1
Runtime.init2({
    'out_length': 3,
    'pad_left': 1,
    'pad_top': 1,
    'stride': 2,
    'f_length': 3,
    'o_length': matrix.sx
}).then(instance => {
    if (!instance || typeof instance === 'string') {
        throw new Error(instance || '不支持float texture');
    }
    inst = instance;
}).then(() => {
    console.dir(['卷积核', filter]);
    console.dir(['origin data', matrix.data]);
    // 执行conv2d
    inst.compute(filter, matrix.data, 'conv2d');
}).then(() => {
    // 读取结果
    const addResult = inst.read();
    console.dir(['conv2d的执行结果', addResult]);
}).catch(err => {
    console.log('-----------error---------' + err);
});

// 执行运行op
/*Runtime.init().then(instance => {
    if (!instance || typeof instance === 'string') {
        throw new Error(instance || '不支持float texture');
    }
    inst = instance;
    return inst.create(imgUrl, shapeA);
}).then(data => {
    console.log('原始图片数据长度是：' + data.data.length);
    return inst.feed(data.data, {
        w: data.width,
        h: data.height
    });
}).then(data => {
    // 生成feed数据[-1, 3, 256, 256]
    shapeAData = new Float32Array(data);
    console.dir(['图片过滤（256 * 256）后的长度是：' + shapeAData.length, shapeAData]);
}).then(() => {
    // 生成shapeB的数据
    shapeBData = inst.mockShapeB(shapeA, shapeB);
    console.dir(['mock的shapeB[3]的数据' + shapeBData.length, shapeBData]);
}).then(() => {
    // 执行加法op
    inst.compute(shapeAData, shapeBData);
}).then(() => {
    // 读取结果
    const addResult = inst.read();
    console.dir(['加法op的执行结果', addResult]);
}).catch(err => {
    console.log('-----------error---------' + err);
});*/
