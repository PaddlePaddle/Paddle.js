/**
 * @file op的数据对象
 * @author yangmingming
 *
 */
/* eslint-disable */
import Tensor from './tensor';
export default class OpData {
    constructor(input = [], output = {}, attrs = {}) {
        this.input = input;
        this.output = output;
        this.attrs = attrs;
        this.buildTensor();
    }

    buildTensor() {
        this.input.forEach();
    }

    dispose() {
        this.input = null;
        this.output = null;
        this.attrs = null;
    }
}
