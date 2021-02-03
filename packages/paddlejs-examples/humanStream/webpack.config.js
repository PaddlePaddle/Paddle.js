const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './index.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8866
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            template: './index.html'
        })
    ],
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js'],
        alias: {
            '@paddlejs/paddlejs-core': path.resolve(__dirname, '../../paddlejs-core/src/'),
            '@paddlejs/paddlejs-backend-webgl': path.resolve(__dirname, '../../paddlejs-backend-webgl/src/'),
            '@paddlejs-mediapipe/camera': path.resolve(__dirname, '../../paddlejs-mediapipe/camera/src/'),
            '@paddlejs-models/humanseg': path.resolve(__dirname, '../../paddlejs-models/humanseg/src/')
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
    },
    node: {
        fs: 'empty'
    }
};
