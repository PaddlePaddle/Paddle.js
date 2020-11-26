/**
 * @file op文件
 * @author zhangjingyuan02
 */

import mul_params from './mul/params';
import mul_main from './mul/main';
export default {
    mul: {
        params: mul_params,
        main: mul_main,
        behaviors: [
            'reshape',
            'needBatch'
        ]
    }
};