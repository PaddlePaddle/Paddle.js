
/**
 * @file op 相关辅助函数
 * @author zhangjingyuan
 */

/**
 * Get extract op name
 * @param {String} name op name
 * @param {Object} attrs op attrs
 * @returns {String} extract op name
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
