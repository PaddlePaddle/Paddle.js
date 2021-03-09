const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
