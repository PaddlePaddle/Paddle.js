import WarpAffine from './warpAffine';
class DetectProcess {
    constructor(result, canvas) {
        this.modelResult = result;
        this.output_size = 10;
        this.anchor_num = 1920;
        this.detectResult = new Array(14).fill('').map(() => []);
        this.hasHand = 0;
        this.originCanvas = canvas;

        let ctx = this.originCanvas.getContext('2d');
        this.originImageData = ctx.getImageData(0, 0, 256, 256);
    }
    async outputBox(results) {
        let splitT = Date.now();
        this.getMaxIndex();
        // console.info('getMaxIndex:', Date.now() - splitT);
        // debugger;
        splitT = Date.now();
        if (this.maxIndex === -1) {
            this.hasHand = 0;
            return false;
        }
        this.hasHand = 1;
        await this.splitAnchors(results);
        // console.info('splitAnchors:', Date.now() - splitT);
        // debugger;
        splitT = Date.now();
        this.decodeAnchor();
        this.decodeKp(); // 求关键点
        this.decodeBox(); // 求手势框
        // console.info('求关键点跟手势框', Date.now() - splitT);
        // debugger;
        return this.box;
    }
    async outputFeed(paddle) {
        let oft = Date.now();
        this.decodeTriangle();
        // console.info('decodeTriangle', Date.now() - oft);
        oft = Date.now();
        this.decodeSource();
        // console.info('decodeSource', Date.now() - oft);
        oft = Date.now();
        this.outputResult();
        // console.info('outputResult', Date.now() - oft);
        oft = Date.now();
        this.getaffinetransform(); // 提取仿射变化矩阵
        // console.info('getaffinetransform', Date.now() - oft);
        oft = Date.now();
        await this.warpAffine(); // 对图片进行仿射变换
        // console.info('warpAffine', Date.now() - oft);
        oft = Date.now();
        this.allReshapeToRGB(paddle);
        // console.info('allReshapeToRGB', Date.now() - oft);
        oft = Date.now();
        return this.feed;
    }
    async splitAnchors(results) {
        window.results = results;
        let anchors = new Array(this.anchor_num).fill('').map(() => []);
        let output_size = this.output_size;
        let anchor_num = this.anchor_num;
        for (let i = 0; i < anchor_num; i++) {
            anchors[i] = [];
            let tmp0 = results[i * 4];
            let tmp1 = results[i * 4 + 1];
            let tmp2 = results[i * 4 + 2];
            let tmp3 = results[i * 4 + 3];
            anchors[i][0] = tmp0 - tmp2 / 2.0;
            anchors[i][1] = tmp1 - tmp3 / 2.0;
            anchors[i][2] = tmp0 + tmp2 / 2.0;
            anchors[i][3] = tmp1 + tmp3 / 2.0;
            if (anchors[i][0] < 0) anchors[i][0] = 0;
            if (anchors[i][0] > 1) anchors[i][0] = 1;
            if (anchors[i][1] < 0) anchors[i][1] = 0;
            if (anchors[i][1] > 1) anchors[i][1] = 1;
            if (anchors[i][2] < 0) anchors[i][2] = 0;
            if (anchors[i][2] > 1) anchors[i][2] = 1;
            if (anchors[i][3] < 0) anchors[i][3] = 0;
            if (anchors[i][3] > 1) anchors[i][3] = 1;
        }
        window.anchors = this.anchors = anchors;

    }
    getMaxIndex() {
        let maxIndex = -1;
        let maxConf = -1;
        let curConf = -2.0;
        let output_size = 10;

        for (let i = 0; i < this.anchor_num; i++) {
            curConf = sigm(this.modelResult[i * output_size + 1]);
            if (curConf > 0.55 && curConf > maxConf) {
                maxConf = curConf;
                maxIndex = i;
            }
        }
        this.maxIndex = maxIndex;
        function sigm(value) {
            return 1.0 / (1.0 + Math.exp(0.0 - value));
        }
    }
    decodeAnchor() {
        let index = this.maxIndex;
        let anchors = this.anchors;
        this.pxmin = anchors[index][0];
        this.pymin = anchors[index][1];
        this.pxmax = anchors[index][2];
        this.pymax = anchors[index][3];
    }
    decodeKp() {
        let modelResult = this.modelResult;
        let index = this.maxIndex;
        let px = (this.pxmin + this.pxmax) / 2;
        let py = (this.pymin + this.pymax) / 2;
        let pw = this.pxmax - this.pxmin;
        let ph = this.pymax - this.pymin;
        let prior_var = 0.1
        let kp = [[], [], []];
        kp[0][0] = (modelResult[index * this.output_size + 6] * pw * prior_var + px) * 256;
        kp[0][1] = (modelResult[index * this.output_size + 8] * ph * prior_var + py) * 256;
        kp[2][0] = (modelResult[index *this. output_size + 7] * pw * prior_var + px) * 256;
        kp[2][1] = (modelResult[index * this.output_size + 9] * ph * prior_var + py) * 256;
        this.kp = kp;
    }
    decodeBox() {
        let modelResult = this.modelResult;
        let output_size = this.output_size || 10;
        let pw = this.pxmax - this.pxmin;
        let ph = this.pymax - this.pymin;
        let px = this.pxmin + pw / 2;
        let py = this.pymin + ph / 2;
        let prior_var = 0.1;
        let index = this.maxIndex;

        let ox = modelResult[output_size * index + 2];
        let oy = modelResult[output_size * index + 3];
        let ow = modelResult[output_size * index + 4];
        let oh = modelResult[output_size * index + 5];

        let tx = ox * prior_var * pw + px;
        let ty = oy * prior_var * ph + py;
        let tw = this.tw = Math.pow(2.71828182, prior_var * ow) * pw;
        let th = this.th = Math.pow(2.71828182, prior_var * oh) * ph;
        let box = [[], [], [], []];
        box[0][0] = parseInt((tx - tw / 2) * 256);
        box[0][1] = parseInt((ty - th / 2) * 256);
        box[1][0] = parseInt((tx + tw / 2) * 256);
        box[1][1] = parseInt((ty - th / 2) * 256);
        box[2][0] = parseInt((tx + tw / 2) * 256);
        box[2][1] = parseInt((ty + th / 2) * 256);
        box[3][0] = parseInt((tx - tw / 2) * 256);
        box[3][1] = parseInt((ty + th / 2) * 256);
        this.box = box;
    }
    decodeTriangle() {
        let box_enlarge = 1.04;
        let side = Math.max(this.tw * 256, this.th * 256) * (box_enlarge);
        let dir_v = [[], []];
        let kp = this.kp;
        let triangle = [[], [], []];
        let dir_v_r = [];

        dir_v[0] = kp[2][0] - kp[0][0];
        dir_v[1] = kp[2][1] - kp[0][1];
        let sq = Math.sqrt(Math.pow(dir_v[0], 2) + Math.pow(dir_v[1], 2)) || 1;
        dir_v[0] = dir_v[0] / sq;
        dir_v[1] = dir_v[1] / sq;

        dir_v_r[0] = dir_v[0] * 0 + dir_v[1] * 1;
        dir_v_r[1] = dir_v[0] * -1 + dir_v[1] * 0;
        triangle[0][0] = kp[2][0];
        triangle[0][1] = kp[2][1];
        triangle[1][0] = kp[2][0] + dir_v[0] * side;
        triangle[1][1] = kp[2][1] + dir_v[1] * side;
        triangle[2][0] = kp[2][0] + dir_v_r[0] * side;
        triangle[2][1] = kp[2][1] + dir_v_r[1] * side;
        this.triangle = triangle;
    }
    decodeSource() {
        let kp = this.kp;
        let box_shift = 0.0; // 为什么c语言是乘以0.0
        let tmp0 = (kp[0][0] - kp[2][0]) * box_shift;
        let tmp1 = (kp[0][1] - kp[2][1]) * box_shift;
        let source = [[], [], []];
        for (let i = 0; i < 3; i++) {
            source[i][0] = this.triangle[i][0] - tmp0;
            source[i][1] = this.triangle[i][1] - tmp1;
        }
        this.source = source;
    }
    outputResult(){
        // let detectResult = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
            this.detectResult[i][0] = this.box[i][0];
            this.detectResult[i][1] = this.box[i][1];
        }
        // 王超的检测模型只保留0、2两个点。
        this.detectResult[4][0] = this.kp[0][0];
        this.detectResult[4][1] = this.kp[0][1];
        this.detectResult[6][0] = this.kp[2][0];
        this.detectResult[6][1] = this.kp[2][1];

        for (let i = 0; i < 3; i++) {
            this.detectResult[i + 11][0] = this.source[i][0];
            this.detectResult[i + 11][1] = this.source[i][1];
        }
        // let point1 = document.getElementById('point1');
        // let point2 = document.getElementById('point2');
        // let point3 = document.getElementById('point3');
        // [point1, point2, point3].forEach((item, index) => {
        //     item.style.top = this.detectResult[11 + index][1] + 'px';
        //     item.style.left = this.detectResult[11 + index][0] + 'px';
        // })
    }
    getaffinetransform() {
        /*
         * 图像上的原始坐标点。需要对所有坐标进行归一化，_x = (x - 128) / 128, _y = (128 - y) / 128
         * 坐标矩阵
         * x1 x2 x3
         * y1 y2 y3
         * z1 z2 z3
        */

        let originPoints = [].concat(this.detectResult[11][0] / 128 -1)
            .concat(this.detectResult[12][0] / 128 -1)
            .concat(this.detectResult[13][0] / 128 -1)
            .concat(1 - this.detectResult[11][1] / 128)
            .concat(1 - this.detectResult[12][1] / 128)
            .concat(1 - this.detectResult[13][1] / 128)
            .concat([1, 1, 1]);
        // originPoints = [0, 0, -1, .1, 1.1, 0.1, 1, 1, 1];
        let matrixA = new Matrix(3, 3, originPoints);
        // 转化后的点[128, 128, 0, 128, 0, 128] [0, 0, -1, 0, 1, 0]
        let matrixB = new Matrix(2, 3, [0, 0, -1, 0, -1, 0]);
        // M * A = B => M = B * A逆
        let _matrixA = inverseMatrix(matrixA.data);
        _matrixA = new Matrix(3, 3, _matrixA);
        let M = Matrix_Product(matrixB, _matrixA);
        this.mtr = M;
    }
    async warpAffine() {
        let wat = Date.now();

        let ctx = this.originCanvas.getContext('2d');
        this.originImageData = ctx.getImageData(0, 0, 256, 256);
        // console.info('=====before getImageData:', Date.now() - wat);
        wat = Date.now();
        let imageDataArr = await WarpAffine.main({
            imageData: this.originImageData,
            mtr: this.mtr.data,
            input: {
                width: 256,
                height: 256
            },
            output: {
                width: 224,
                height: 224
            }
        });

        // console.info('=====warpAffine main:', Date.now() - wat);
        wat = Date.now();
        this.imageData = new ImageData(Uint8ClampedArray.from(imageDataArr), 224, 224)

        // console.info('=====after getImageData:', Date.now() - wat);
    }

    allReshapeToRGB(paddle) {
        let data = paddle.io.allReshapeToRGB(this.imageData, {
            gapFillWith: "#000",
            mean: [0, 0, 0],
            scale: 224,
            std: [1, 1, 1],
            targetShape: [1, 3, 224, 224],
            targetSize: {
                width: 224,
                height: 224
            },
            normalizeType: 1
        })
        this.feed = [{
            data: data,
            shape: [1, 3, 224, 224],
            name: 'image',
            canvas: this.originImageData
        }];
    }
}


class Matrix {
    constructor(row, col, arr = []){
    	this.row = row;  //行
    	this.col = col;  //列
        if (arr[0] && arr[0] instanceof Array) {
            this.data = arr;
        }
        else {
            this.data = [];
            let _arr = [].concat(arr);
        	let Matrix = new Array(row);  //创建row个元素的空数组
        	for(let i = 0; i < row; i++){ //对第一层数组遍历
        		Matrix[i] = new Array(col).fill('');  //每一行创建col列的空数组
                Matrix[i].forEach((item, index, cur) => {
                    cur[index] = _arr.shift() || 0;
                });
        	}
            this.data = Matrix; //将矩阵保存到this.data上
        }
    }
}
function Matrix_Product(A, B){
	let tempMatrix = new Matrix(A.row, B.col);
	if(A.col == B.row){
		for(let i = 0;i < A.row;i++){
			for(let j = 0; j < B.col; j++){
                tempMatrix.data[i][j] = 0;
                for(let n = 0; n < A.col; n++){
					tempMatrix.data[i][j] += A.data[i][n] * B.data[n][j];
				}
                tempMatrix.data[i][j] = tempMatrix.data[i][j].toFixed(5);
			}
		}
		return tempMatrix;
	}
}

// 求行列式
function determinant(matrix) {
    var order = matrix.length,
        cofactor,
        result = 0;
    if (order == 1) {
        return matrix[0][0];
    }
    for (var i = 0; i < order; i++) {
        cofactor = [];
        for (var j = 0; j < order-1; j++) {
            cofactor[j] = [];
            for (var k = 0; k < order - 1; k++) {
                cofactor[j][k] = matrix[j+1][ k<i ? k : k+1 ];
            }
        }
        result += matrix[0][i] * Math.pow(-1, i) * determinant(cofactor);
    }
    return result;
}

// 矩阵数乘
function scalarMultiply(num, matrix) {
    var row = matrix.length,
        col = matrix[0].length,
        result = [];
    for (var i = 0; i < row; i++) {
        result[i] = [];
        for (var j = 0; j < col; j++) {
            result[i][j] = num * matrix[i][j];
        }
    }
    return result;
}

// 矩阵转置
function transpose(matrix) {
    var row = matrix.length,
        col = matrix[0].length,
        result = [];
    for (var i = 0; i < col; i++) {
        result[i] = [];
        for (var j = 0; j < row; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

// 矢量内积
function dotProduct(vector1, vector2) {
    var n = Math.min(vector1.length, vector2.length),
        result = 0;
    for (var i = 0; i < n; i++) {
        result += vector1[i] * vector2[i];
    }
    return result;
}

// 矩阵乘法
function multiply(matrix1, matrix2) {
    if (matrix1[0].length !== matrix2.length) {
        return false;
    }
    var row = matrix1.length,
        col = matrix2[0].length,
        matrix2_t = transpose(matrix2);
        result = [];
    for (var i = 0; i < row; i++) {
        result[i] = [];
        for (var j = 0; j < col; j++) {
            result[i][j] = dotProduct(matrix1[i], matrix2_t[j]);
        }
    }
    return result;
}

// 求逆矩阵
function inverseMatrix(matrix) {
    if (determinant(matrix) === 0) {
        return false;
    }
    // 求代数余子式
    function cofactor(matrix, row, col) {
        var order = matrix.length,
            new_matrix = [],
            _row, _col;
        for (var i = 0; i < order-1; i++) {
            new_matrix[i] = [];
            _row = i < row ? i : i + 1;
            for (var j = 0; j < order-1; j++) {
                _col = j < col ? j : j + 1;
                new_matrix[i][j] = matrix[_row][_col];
            }
        }
        return Math.pow(-1, row + col) * determinant(new_matrix);
    }
    var order = matrix.length,
        adjoint = [];
    for (var i = 0; i < order; i++) {
        adjoint[i] = [];
        for (var j = 0; j < order; j++) {
            adjoint[i][j] = cofactor(matrix, j, i);
        }
    }
    return scalarMultiply(1/determinant(matrix), adjoint);
}

export default DetectProcess;
