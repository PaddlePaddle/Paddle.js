const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './demo/index.ts',
        gpu: './demo/index_gpu.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        port: 8866
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            template: './demo/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'gpu.html',
            chunks: ['gpu'],
            template: './demo/index.html'
        })
    ],
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js']
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
    },
    node: {
        fs: 'empty'
    }
};
