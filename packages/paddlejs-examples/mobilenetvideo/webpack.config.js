const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './index.ts',
    devServer: {
        port: 9002
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ],
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js'],
        alias: {
            '@paddlejs-models/mobilenet': path.resolve(__dirname, '../../paddlejs-models/mobilenet/src/'),
            '@paddlejs-mediapipe/camera': path.resolve(__dirname, '../../paddlejs-mediapipe/camera/src/')
        }
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
