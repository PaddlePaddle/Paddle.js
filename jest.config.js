module.exports = {
    testEnvironment: 'node',
    transform: {
        // 将.js后缀的文件使用babel-jest处理
        '^.+\\.(js|es6)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'es6'],
    testMatch:  [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)*(spec|test).[jt]s?(x)" ]
};
