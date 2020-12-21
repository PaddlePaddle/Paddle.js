
/**
 * @file op 相关辅助函数
 * @author zhangjingyuan02
 */

function getExactOpName(name, attrs) {
    if (name === 'concat' && attrs['binding_appender']) {
        return 'concat_mul';
    }
    return name;
}

export {
    getExactOpName
};
