/**
 * @file 打包到rd机器的配置
 */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: '[name].css'
});

module.exports = {
    // mode: 'development',
    mode: 'production',
    devtool: 'none',
    optimization: {
        minimize: true
    },
    entry: {
        index: ['./src/index']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './pub/dist'),
        library: 'panorama',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [{
            test: /\.(es6|js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime']
                }
            }
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
            loader: 'url-loader?limit=30000&name=[name].[ext]'
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract([
                {loader: 'css-loader', options: {minimize: true}},
                {loader: 'less-loader'}
            ])
        }]
    },
    plugins: [extractLess],
    resolve: {
        extensions: ['.es6', '.js', '.json']
    }
};
