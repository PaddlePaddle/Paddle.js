const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: [path.resolve(__dirname, './src/index')]
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js'],
        alias: {
            '@paddlejs/paddlejs-core': path.resolve(__dirname, '../paddlejs-core/src/')
        },
        fallback: {
            path: require.resolve('path-browserify'),
            fs: false,
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify')
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'lib/**/*')]
        })
    ],
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
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd',
        library: 'paddlejsWasmBackend',
        publicPath: '/'
    }
};
