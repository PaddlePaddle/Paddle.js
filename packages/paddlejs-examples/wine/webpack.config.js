const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 定义自动获取本地ip
function getNetworkIp() {
    // 打开的host
    let needHost = '';
    try {
        // 获得网络接口列表
        const network = os.networkInterfaces();
        for (const dev in network) {
            const iface = network[dev];
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    needHost = alias.address;
                }
            }
        }
    }
    catch (e) {
        needHost = 'localhost';
    }
    return needHost;
}

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './index.js',
    devServer: {
        hot: true,
        host: getNetworkIp(),
        port: 9001
    },
    plugins: [
        new CleanWebpackPlugin({
            // 允许清除在当前脚本的工作目录外边的匹配的文件
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: 'index.css'
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime']
                    }
                }
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name].[ext]'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract([
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ])
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
