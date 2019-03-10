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
inst = Runtime.init({
    'width_raw_canvas': 512,
    'height_raw_canvas': 512
});
console.dir(['测试数据---卷积核', filter.data]);
console.dir(['测试数据---输入tensor', matrix.data]);
// 执行op conv2d
inst.run('conv2d', {
    'length_shape_filter': 4,
    'width_shape_filter': 3,
    'height_shape_filter': 3,
    'channel_filter': 4,
    'width_texture_filter': filter.texture_width,
    'height_texture_filter': filter.texture_height,
    filter,
    'length_shape_origin': 4,
    'width_shape_origin': 5,
    'height_shape_origin': 5,
    'channel_origin': 4,
    'width_texture_origin': matrix.texture_width,
    'height_texture_origin': matrix.texture_height,
    origin: matrix,
    'width_shape_out': 3,
    'height_shape_out': 3,
    'channel_out': 4,
    'length_shape_out': 4,
    'width_texture_out': 3,
    'height_texture_out': 3,
    'shape_out': [1, 4, 3, 3],
    'stride_horizontal': 1,
    'stride_vertical': 1,
    'pad_left': 1,
    'pad_top': 1,
    'dilation_horizontal': 2,
    'dilation_vertical': 2,
    'multi_value': '1.0',
    'bias_value': '0.0',
    'active_function': 'scale'
}).then(() => {
    console.log('执行dynamic:scale');
    // 执行dynamic
    return inst.run('dynamic', {
        'multi_value': '1.0',
        'bias_value': '1.0',
        'active_function': 'scale',
        origin: matrix,
        'width_shape_out': 3,
        'height_shape_out': 3,
        'length_shape_out': 4,
        'width_texture_out': 3,
        'height_texture_out': 3
    });
}).then(() => {
    // 读取结果
    const addResult = inst.read();
    console.dir(['测试数据---op的执行结果', addResult]);
}).catch(err => {
    console.log('-----------error---------' + err);
});
const matrixPool = Runtime.mockPoolOrigin();
matrixPool['numbers_shape_out'] = [100, 25, 5, 1];
const matrixPool2 = Runtime.mockPoolOrigin2();
matrixPool2['numbers_shape_out'] = [100, 25, 5, 1];
let doElementwiseAdd = () => {
    let elementwiseAddParams = {
        'multi_value': '1.0',
        'bias_value': '1.0',
        'active_function': 'scale',
        origin: matrixPool,
        origin2: matrixPool2,
        'width_shape_out': 5,
        'height_shape_out': 5,
        'length_shape_out': 4,
        'width_texture_out': 5,
        'height_texture_out': 5
    };
    return inst.run('elementwise_add', elementwiseAddParams)
    .then(() => {
        // 读取结果
        const addResult = inst.read();
        console.dir(['测试数据---op的执行结果', addResult]);
        addResult.forEach((item, index) => {
            let resData = matrixPool.data[index] + matrixPool2.data[index];
            console.log(item, resData, parseFloat(item - resData).toFixed(2));
        });
    }).catch(err => {
        console.log('-----------error---------' + err);
    });
};
// doElementwiseAdd();
let doPool2d = () => {
    let pool2dParams = {
        'width_shape_pool': 3,
        'height_shape_pool': 3,
        'type_pool': 0, // 1表示最大池化 0表示平均池化
        'length_shape_origin': 4,
        'width_shape_origin': 5,
        'height_shape_origin': 5,
        'channel_origin': 4,
        'width_texture_origin': matrixPool.texture_width,
        'height_texture_origin': matrixPool.texture_height,
        origin: matrixPool,
        'width_shape_out': 5,
        'height_shape_out': 5,
        'channel_out': 4,
        'length_shape_out': 4,
        'width_texture_out': 5,
        'height_texture_out': 5,
        'shape_out': [1, 4, 5, 5],
        'stride_horizontal': 1,
        'stride_vertical': 1,
        'pad_left': 1,
        'pad_top': 1,
        'dilation_horizontal': 2,
        'dilation_vertical': 2
    };
    // 执行op pool2d
    inst.run('pool2d', pool2dParams).then(() => {
        // 读取结果
        const addResult = inst.read();
        console.dir(['测试数据---op的执行结果', addResult]);
        let testArr = [];
        matrixPool.data.forEach((item, index) => {
            if (index % 5 === 0) {
                testArr[Math.floor(index / 5)] = [];
            }
            testArr[Math.floor(index / 5)].push(item);
        });
        let maxArr = [];
        for (let d = 0; d < 4; d++) {
            for (let v = 0; v < 5; v++) {
                for (let h = 0; h < 5; h++) {
                    let max = 0.0;
                    let countPool = 0;
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 3; x++) {
                            if (!((v === 0 && y === 0)
                                || (h === 0 && x === 0)
                                || (v === 4 && y === 2)
                                || (h === 4 && x === 2))) {
                                let curr = testArr[y + (5 * d) + (v - 1)][x + (h - 1)];
                                if (pool2dParams.type_pool) {
                                    if (curr > max) {
                                        max = curr;
                                    }
                                }
                                else {
                                    max += curr;
                                    countPool++;
                                }
                            }
                        }
                    }
                    if (!pool2dParams.type_pool) {
                        max = max / countPool;
                    }
                    maxArr.push(max);
                }
            }
        }
        console.log(testArr);
        console.log(maxArr);
        addResult.forEach((item, index)=> {
            console.log(item, maxArr[index], parseFloat(item - maxArr[index]).toFixed(2));
        });
    }).catch(err => {
        console.log('-----------error---------' + err);
    });
};
// doPool2d();
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
