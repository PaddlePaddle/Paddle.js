/**
 * @file fill_constant_batch_size_like
 */

function mainFunc(
    {},
    { value }
) {
    return `
    // start函数
    void main(void) {
        float res = float(${value});
        setOutput(res);
    }
`;
}
export default {
    mainFunc
};
