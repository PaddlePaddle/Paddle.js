/* eslint-disable */
/**
* @file 激活函数
* @author chenhaoze
*/
// 激活函数
export default `
float relu6(float x, float threshold = 6.0 , float b) {
    float result = max(0,x);
    result = min(result,threshold);
    return result;
}
`;
