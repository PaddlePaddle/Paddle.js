/**
 * @file 工具类
 * @author yangmingming
 */
/* eslint-disable */

let GPU_TEXTURE_MAX_SIZE = null;

export default {
    setTextureMaxSize(size) {
        GPU_TEXTURE_MAX_SIZE = size;
    },
    getQueryTime(gl, query) {
        const timeElapsedNanos = gl.getQueryParameter(query, gl.QUERY_RESULT);
        // Return milliseconds.
        return timeElapsedNanos;
    },
    beginQuery(gl, glVersion) {
        if (glVersion === 2) {
            const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
            if (!ext) {
                return;
            }
            const query = gl.createQuery();
            gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
            return query;
        }
        return null;
    },
    endQuery(gl, glVersion, query) {
        if (glVersion === 2) {
            const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
            if (!ext) {
                return;
            }
            gl.endQuery(ext.TIME_ELAPSED_EXT);
        }
        return query;
    },
    // todo: 适用2维矩阵乘法，以后实现通用版本
    getReshapeInPaddle(inputShape = [], counterShape = [], outShape = []) {
        let total = inputShape.reduce((all, num) => all * num);
        if (outShape.length === 1) {
            return [1, total];
        } else {
            return [outShape[0], total / outShape[0]];
        }
    },

    getBroadcastShapeInPaddle(shapeA= [], shapeB = [], axis = 1) {
        // todo: 简易版本，以后需要实现一个通用版本
        let bigger = shapeA;
        let result = shapeB;
        if (shapeA.length - shapeB.length < 0) {
            bigger = shapeB;
            result = shapeA;
        }
        return result.concat(bigger.slice(axis));
    },

    getBroadcastDims(inShape = [], outShape = []) {
        const inRank = inShape.length;
        const dims = [];
        for (let i = 0; i < inRank; i++) {
            const dim = inRank - 1 - i;
            const a = inShape[dim] || 1;
            const b = outShape[outShape.length - 1 - i] || 1;
            if (b > 1 && a === 1) {
                dims.unshift(dim);
            }
        }
        return dims;
    },

    getBroadcastShape(shapeA = [], shapeB = []) {
        const result = [];
        const max = Math.max(shapeA.length, shapeB.length);
        for (let i = 0; i < max; i++) {
            let a = shapeA[shapeA.length - i - 1];
            if (a === null) {
                a = 1;
            }
            let b = shapeB[shapeB.length - i - 1];
            if (b === null) {
                b = 1;
            }
            if (a === 1) {
                result.unshift(b);
            } else if (b === 1) {
                result.unshift(a);
            } else if (a !== b) {
                return null;
            } else {
                result.unshift(a);
            }
        }
        return result;
    },

    applyFilterWinograd(data, shape) {
        const [b, c, h, w] = shape;
        let offset = 0;
        let index = 0;
        const result = new Float32Array(b * c * 16);
        // h和w是3、3
        const size2D = 9;
        for (let i = 0; i < b; i++) {
            // let index = i * c * size2D;
            for (let j = 0; j < c; j++) {
                // index += j * size2D;
                const filter = data.subarray(index, index + size2D);
                const [f11, f12, f13, f21, f22, f23, f31, f32, f33] = filter;
                const square = [
                    f11,
                    0.5 * f11 + 0.5 * f12 + 0.5 * f13,
                    0.5 * f11 - 0.5 * f12 + 0.5 * f13,
                    f13,
                    0.5 * f11 + 0.5 * f21 + 0.5 * f31,
                    0.25 * f11 + 0.25 * f12 + 0.25 * f13 + 0.25 * f21 + 0.25 * f22 + 0.25 * f23 + 0.25 * f31 + 0.25 * f32 + 0.25 * f33,
                    0.25 * f11 - 0.25 * f12 + 0.25 * f13 + 0.25 * f21 - 0.25 * f22 + 0.25 * f23 + 0.25 * f31 - 0.25 * f32 + 0.25 * f33,
                    0.5 * f13 + 0.5 * f23 + 0.5 * f33,
                    0.5 * f11 - 0.5 * f21 + 0.5 * f31,
                    0.25 * f11 + 0.25 * f12 + 0.25 * f13 - 0.25 * f21 - 0.25 * f22 - 0.25 * f23 + 0.25 * f31 + 0.25 * f32 + 0.25 * f33,
                    0.25 * f11 - 0.25 * f12 + 0.25 * f13 - 0.25 * f21 + 0.25 * f22 - 0.25 * f23 + 0.25 * f31 - 0.25 * f32 + 0.25 * f33,
                    0.5 * f13 - 0.5 * f23 + 0.5 * f33,
                    f31,
                    0.5 * f31 + 0.5 * f32 + 0.5 * f33,
                    0.5 * f31 - 0.5 * f32 + 0.5 * f33,
                    f33
                ];
                result.set(square, offset);
                offset += 16;
                index += size2D;
            }
        }
        return result;
    },

    /**
     * 获取texture形状和补0个数
     * @param shape {Array} tensor的形状
     * @return {{shape: *[], zeroNumber: number}} {Object} texture信息
     */
    getTextureInfoFromTensorShape(shape = [], isPacked = false) {
        let b = shape[0];
        let c = shape[1];
        let h = shape[2];
        let w = shape[3];
        let height = b * h;
        let width = c * w;
        let offsetX = 0;
        let offsetY = 0;
        // 安卓和ios的max texture size是4096, 改造存储空间(4bh, cw / 4)
        let exceedMax = false;
        // trick TEXTURE_SIZE 超限问题，后续升级更优解
        if (height > GPU_TEXTURE_MAX_SIZE || width > GPU_TEXTURE_MAX_SIZE) {
            console.error('大小超限', shape);
            height *= 4;
            width = c * (Math.ceil(w / 4));
            exceedMax = true;
            if (height > GPU_TEXTURE_MAX_SIZE || width > GPU_TEXTURE_MAX_SIZE) {
                const requested = `[${width}x${height}]`;
                const max = `[${GPU_TEXTURE_MAX_SIZE}x${GPU_TEXTURE_MAX_SIZE}]`;
                throw new Error(
                    'Requested texture size ' + requested +
                    ' greater than WebGL maximum on this browser / GPU ' + max + '.');
            }
        }
        if (isPacked) {
            // 紧凑布局
            height = b * c * Math.ceil(h / 2);
            width = Math.ceil(w / 2);
            offsetX = w % 2;
            offsetY = h % 2;
        }
        return {
            offsetX,
            offsetY,
            exceedMax,
            shape: [4, height, width],
            zeroNumber: 0
        };
    },

    // 获取数组中的最大值和索引
    getMaxItem(datas = []) {
        let max = Math.max.apply(null, datas);
        let index = datas.indexOf(max);
        return {value: max, index};
    },

    // 压缩
    async loadShader(name) {
        let shader = await fetch(this.getShaderFile(name));
        return shader.text();
    },

    getShaderFile(url) {
        // todo: 根据脚手架获取shader文件
        const aa = url.split('/');
        let length = aa.length;
        return '/' + aa[length - 1];
    },

    img2texture(renderData = {}) {
        const {height_texture, width_texture, shape} = renderData;
        const total = height_texture * width_texture * 4;
        const b = shape[0];
        const c = shape[1];
        const h = shape[2];
        const w = shape[3];
        let data = new Float32Array(b * c * h * w * 4);
        let offset = 0;
        for (let i = 0; i < total; i++) {
            let j = (i / (c * w)) | 0;
            let k = i % (c * w);
            let b1 = j / h | 0;
            let h1 = j % h;
            let c1 = k % c;
            let w1 = k / c | 0;
            let l = b1 * (c * h * w) + c1 * (h * w) + h1 * (w) + w1;
            data[offset] = renderData.data[l];
            offset += 4;
            // data.push(renderData.data[l]);
            // data.push(0);
            // data.push(0);
            // data.push(0);
        }
        renderData.data = data;
    },
    /*
     * 将shape扩充到4维，在shape前补1
     */
    padToFourDimShape(shape) {
        let fourDimShape = [];
        if (shape.length == 4) {
            fourDimShape = shape;
        } else if (shape.length < 4) {
            for (let i = 0; i < 4 - shape.length; i++) {
                fourDimShape.push(1);
            }
            fourDimShape = fourDimShape.concat(shape);
        }
        return fourDimShape;
    },

    /*
     * 将nhwc排布数据转为nchw排布数据
     */
    nhwc2nchw(data, shape) {
        let N = shape[0];
        let H = shape[1];
        let W = shape[2];
        let C = shape[3];
        let WXC = W * C;
        let HXWXC = H * W * C;
        let nchwData = [];
        for (let n = 0; n < N; n++) {
            for (let c = 0; c < C; c++) {
                for (let h = 0; h < H; h++) {
                    for (let w = 0; w < W; w++) {
                        nchwData.push(data[n * HXWXC + h * WXC + w * C + c]);
                    }
                }
            }
        }
        return nchwData;
    },

    /*
     * 将nchw排布数据转为nhwc排布数据
     */
    nchw2nhwc(data, shape) {
        let N = shape[0];
        let C = shape[1];
        let H = shape[2];
        let W = shape[3];
        let HXW = H * W;
        let CXHXW = C * H * W;
        let nhwcData = [];
        for (let n = 0; n < N; n++) {
            for (let h = 0; h < H; h++) {
                for (let w = 0; w < W; w++) {
                    for (let c = 0; c < C; c++) {
                        nhwcData.push(data[n * CXHXW + c * HXW + h * W + w]);
                    }
                }
            }
        }
        return nhwcData;
    },

    /*
     * 等距间隔打印数据
     */
    stridePrint(data, count = 20) {
        let realPrintCount = count;
        if (data.length <= realPrintCount) {
            this.continuousPrint(data, realPrintCount);
            return;
        }
        let numbers = [];
        let stride = Math.floor(data.length / realPrintCount);
        if (stride == 0) {
            stride = 1;
        }
        realPrintCount = Math.floor(data.length / stride)
        for (let i = 0; i < realPrintCount; i++) {
            numbers.push(i * stride + ": " + data[i * stride]);
        }
        console.log(numbers);
    },

    /*
     * 连续打印数据
     */
    continuousPrint(data, count = 100) {
        let numbers = [];
        let realPrintCount = count;
        if (data.length <= realPrintCount) {
            realPrintCount = data.length;
        }
        for (let i = 0; i < realPrintCount; i++) {
            numbers.push(i + ": " + data[i]);
        }
        console.log(numbers);
    },

    softmax(nchwData) {
        let result = new Float32Array(nchwData.length);
        let maxValue = nchwData[0];
        let tempValue = 0.0;
        let sumValue = 0.0;
        for (let i = 1; i < nchwData.lenght; i++) {
            tempValue = nchwData[i];
            if (maxValue < tempValue) {
                maxValue = tempValue;
            }
        }
        for (let i = 0; i < nchwData.length; i++) {
            tempValue = Math.exp(nchwData[i] - maxValue);
            result[i] = tempValue;
            sumValue = sumValue + tempValue;
        }
        for (let i = 0; i < nchwData.length; i++) {
            result[i] = result[i] / sumValue;
        }
        return result;

    },

    // 针对model final texture输出超限后，inst.read读取数据不对的case
    formatReadData(nchwData, nchwShape) {
        if (nchwShape.length < 4) {
            let batch = [];
            for (let i = 0; i < (4 - nchwShape.length); i++) {
                batch.push(1);
            }
            nchwShape = batch.concat(nchwShape);
        }
        const shape_b = nchwShape[0];
        const shape_c = nchwShape[1];
        const shape_h = nchwShape[2];
        const shape_w = nchwShape[3];
        const texture_height = shape_b * shape_h;
        const texture_width = shape_c * shape_w;

        if (texture_height <= GPU_TEXTURE_MAX_SIZE && texture_width <= GPU_TEXTURE_MAX_SIZE) {
            return nchwData;
        }
        let pos = 0;
        const formatData = [];
        const pieceW = Math.ceil(shape_w / 4); // reshape后的 shape_width

        for (let bIndex = 0; bIndex < shape_b; bIndex++) {
            for (let cIndex = 0; cIndex < shape_c; cIndex++) {
                for (let hIndex = 0; hIndex < shape_h; hIndex++) {
                    for (let wIndex = 0; wIndex < shape_w; wIndex++) {
                        pos = Math.floor(wIndex / pieceW) * pieceW * (shape_h - 1) + wIndex + hIndex * pieceW;
                        pos += bIndex * shape_c * shape_h * shape_w+ cIndex  * shape_h * shape_w;
                        formatData.push(nchwData[pos]);
                    }
                }
            }
        }

        return formatData;
    },
    // 小数转百分比
    toPercent(data) {
        let str = Number(data * 100).toFixed(3);
        return str += '%';
    }
};
/* eslint-enable */
