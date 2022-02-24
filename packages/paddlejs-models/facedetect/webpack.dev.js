const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './demo/index.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        port: 8867
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            template: './demo/index.html'
        })
    ],
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js']
        // 调试时开启执行本地 Paddle.js逻辑
        // alias: {
        //     '@paddlejs/paddlejs-backend-webgl': path.resolve(__dirname, '../../paddlejs-backend-webgl/src/index.ts'),
        //     '@paddlejs/paddlejs-core': path.resolve(__dirname, '../../paddlejs-core/src/index.ts')
        // }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
