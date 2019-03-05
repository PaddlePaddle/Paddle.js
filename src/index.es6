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
    'length_shape_filter': 4,
    'width_shape_filter': 3,
    'height_shape_filter': 3,
    'width_texture_filter': filter.texture_width,
    'height_texture_filter': filter.texture_height,
    'width_shape_origin': matrix.texture_width,
    'height_shape_origin': matrix.texture_height,
    'width_shape_out': 3,
    'height_shape_out': 3,
    'stride_horizontal': 1,
    'stride_vertical': 1,
    'pad_left': 1,
    'pad_top': 1,
    'dilation_horizontal': 2,
    'dilation_vertical': 2,
    'width_raw_canvas': 512,
    'height_raw_canvas': 512,
    'shape_numbers': filter.shapeNumbers
}).then(instance => {
    if (!instance || typeof instance === 'string') {
        throw new Error(instance || '不支持float texture');
    }
    inst = instance;
}).then(() => {
    console.dir(['测试数据---卷积核', filter.data]);
    console.dir(['测试数据---输入tensor', matrix.data]);
    // 执行conv2d
    inst.compute({
        filter,
        origin: matrix
    });
}).then(() => {
    // 读取结果
    const addResult = inst.read();
    console.dir(['测试数据---op的执行结果', addResult]);
}).catch(err => {
    console.log('-----------error---------' + err);
});
// Runtime.init2({
//     'filter_size_width': 3,
//     'filter_size_height': 3,
//     'origin_size_width': matrix.sx,
//     'origin_size_height': matrix.sx,
//     'out_size_width': 3,
//     'out_size_height': 3,
//     'stride_horizontal': 1,
//     'stride_vertical': 1,
//     'pad_left': 1,
//     'pad_top': 1,
//     'dilation_horizontal': 2,
//     'dilation_vertical': 2,
//     'filter_shape_length': 4,
//     'tensor_length': 9,
//     'shape_length': 4,
//     'filter_texture_width': filter.texture_width,
//     'filter_texture_height': filter.texture_height,
//     'shape_numbers': filter.shapeNumbers
// }).then(instance => {
//     if (!instance || typeof instance === 'string') {
//         throw new Error(instance || '不支持float texture');
//     }
//     inst = instance;
// }).then(() => {
//     console.dir(['测试数据---卷积核', filter.data]);
//     console.dir(['测试数据---输入tensor', matrix.data]);
//     // 执行conv2d
//     inst.compute(filter, matrix);
// }).then(() => {
//     // 读取结果
//     const addResult = inst.read();
//     console.dir(['测试数据---op的执行结果', addResult]);
// }).catch(err => {
//     console.log('-----------error---------' + err);
// });

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
