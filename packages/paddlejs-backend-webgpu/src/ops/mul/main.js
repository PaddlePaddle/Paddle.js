/**
 * @file mul主函数
 * @author zhangjingyuan02
 */
export default `
layout(std430, set = 0, binding = BINDING_ORIGIN) readonly buffer OriginMatrix {
    float numbers[];
} originMatrix;
layout(std430, set = 0, binding = BINDING_COUNTER) readonly buffer CounterMatrix {
    float numbers[];
} counterMatrix;
layout(std430, set = 0, binding = BINDING_OUT) buffer ResultMatrix {
    float numbers[];
} resultMatrix;

void main() {
    ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    float result = 0.0;
    for (int i = 0; i < width_texture_origin; i++) {
        int a = i + resultCell.x * width_texture_origin;
        int b = resultCell.y + i * width_texture_counter;
        result += originMatrix.numbers[a] * counterMatrix.numbers[b];
    }
    int index = resultCell.y + resultCell.x * width_texture_counter;
    resultMatrix.numbers[index] = result;
}
`;
