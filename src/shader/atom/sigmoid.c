// 激活函数
float sigmoid(float x) {
    float result = 1.0 / (1.0 + exp(-x));
    return result;
}
