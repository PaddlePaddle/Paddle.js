/**
 * @file 工具类
 * @author yangmingming
 */
export default {
    async loadShader(name) {
        let shader = await fetch(name);
        return shader.text();
    },

    // 获取一个数的幂，用来设定图片的大小
    getPower(num = 2) {
        return Math.ceil(Math.log2(num));
    },

    // 探测形状
    infoShape(shape = [], factor = []) {
        let needInfo = false;
        let numbers = shape.reduce((total, item) => {
            if (item > 0) {
                total *= item;
            } else {
                needInfo = true;
            }
            return total;
        }, 1);
        if (!needInfo) {
            return shape;
        }
        let dim = Math.floor(factor.length / numbers);
        return shape.map(item => item > 0 ? item : dim);
    }
};

