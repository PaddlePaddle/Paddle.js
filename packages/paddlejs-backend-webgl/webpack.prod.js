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
        globalObject: 'this',
        library: ['paddlejs', 'webglBackend'],
        publicPath: '/'
    }
};
