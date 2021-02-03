const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        // index: './assembly/index.ts',
        enc: './src/index'
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        port: 9000
    },
    plugins: [
        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),
        new HtmlWebpackPlugin({
            filename: 'enc.html',
            chunks: ['enc'],
            template: './server/index.html'
        }),
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
                include: path.resolve(__dirname, "src")
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    }
};
