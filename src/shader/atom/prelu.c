// 激活函数
float prelu(float x, float p) {
    float result = x;
    if (x < 0.0) {
        result = x * p;
    }
    return result;
}
